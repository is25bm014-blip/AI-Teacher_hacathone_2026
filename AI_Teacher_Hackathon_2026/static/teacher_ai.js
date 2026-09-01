/* ============================================================
   AI HUMAN TEACHER RUNTIME
   Connects:
   - teacher.mp4
   - AI lesson explanation
   - speech
   - Start / Pause
   - Next Step
   - Smart board
   - Teacher movement
   ============================================================ */

(function () {
    "use strict";

    let teacherVideo = null;
    let teacherStage = null;
    let board = null;
    let teacherVoice = null;
    let isRunning = false;

    /* ========================================================
       INITIALIZE
       ======================================================== */

    function initTeacher() {

        console.log("AI Teacher: initializing...");

        const teacherCard =
            document.querySelector(".teacherCard");

        if (!teacherCard) {

            console.error(
                "AI Teacher: .teacherCard not found."
            );

            return;
        }

        /* Prevent duplicate teacher */
        if (document.getElementById("humanAITeacher")) {
            console.log("AI Teacher already initialized.");
            return;
        }

        /* ====================================================
           CREATE TEACHER STAGE
           ==================================================== */

        teacherStage =
            document.createElement("div");

        teacherStage.id =
            "humanAITeacher";

        teacherStage.innerHTML = `

            <div class="aiTeacherScene">

                <!-- SMART BOARD -->
                <div class="aiTeacherBoard">

                    <div class="boardTop">
                        <span>AI SMART BOARD</span>
                        <span class="liveIndicator">
                            ● LIVE
                        </span>
                    </div>

                    <div
                        id="teacherBoardContent"
                        class="boardContent"
                    >
                        <h1>
                            Welcome to AI Classroom
                        </h1>

                        <p>
                            Your AI Teacher is ready.
                        </p>
                    </div>

                </div>


                <!-- TEACHER AREA -->
                <div class="teacherArea">

                    <div class="teacherGlow"></div>

                    <!-- VIDEO TEACHER -->
                    <video
                        id="teacherVideo"
                        class="teacherVideo"
                        src="/static/teacher.mp4"
                        playsinline
                        preload="auto"
                        loop
                        muted
                    ></video>

                    <!-- VIDEO STATUS -->
                    <div
                        id="teacherStatus"
                        class="teacherStatus"
                    >
                        👨‍🏫 AI Teacher Ready
                    </div>

                </div>


                <!-- TEACHER EXPLANATION -->
                <div class="teacherSpeechBox">

                    <div class="speechHeader">
                        👨‍🏫 Teacher is explaining...
                    </div>

                    <div
                        id="teacherSpeechText"
                        class="speechText"
                    >
                        Generate a lesson to start
                        your AI classroom.
                    </div>

                </div>

            </div>
        `;

        /*
         * Put the teacher at the beginning of the card.
         * This means we don't need to redesign your HTML.
         */

        teacherCard.prepend(teacherStage);

        teacherVideo =
            document.getElementById(
                "teacherVideo"
            );

        board =
            document.getElementById(
                "teacherBoardContent"
            );

        teacherVoice =
            document.getElementById(
                "teacherSpeechText"
            );

        addTeacherStyles();

        setupVideo();

        connectExistingApp();

        console.log(
            "AI Teacher: READY"
        );
    }


    /* ========================================================
       VIDEO SETUP
       ======================================================== */

    function setupVideo() {

        if (!teacherVideo) {
            return;
        }

        teacherVideo.addEventListener(
            "loadeddata",
            function () {

                console.log(
                    "Teacher video loaded successfully."
                );

                setTeacherStatus(
                    "👨‍🏫 AI Teacher Ready"
                );
            }
        );


        teacherVideo.addEventListener(
            "error",
            function () {

                console.error(
                    "Teacher video could not be loaded."
                );

                setTeacherStatus(
                    "⚠ Teacher video not found"
                );
            }
        );
    }


    /* ========================================================
       CONNECT WITH YOUR EXISTING APP.JS
       ======================================================== */

    function connectExistingApp() {

        /*
         * Watch lesson text.
         * Your existing app.js changes:
         *
         * #lessonText
         *
         * whenever AI teaching starts.
         */

        const lessonText =
            document.getElementById(
                "lessonText"
            );

        if (!lessonText) {

            console.warn(
                "lessonText element not found."
            );

            return;
        }

        const observer =
            new MutationObserver(
                function () {

                    const text =
                        lessonText.textContent.trim();

                    if (
                        text &&
                        text !==
                        "The AI teacher is preparing the explanation..."
                    ) {

                        showTeacherExplanation(
                            text
                        );
                    }
                }
            );

        observer.observe(
            lessonText,
            {
                childList: true,
                subtree: true,
                characterData: true
            }
        );
    }


    /* ========================================================
       START TEACHER
       ======================================================== */

    window.startTeacher =
        async function () {

            console.log(
                "Starting AI Teacher..."
            );

            isRunning = true;

            setTeacherStatus(
                "👨‍🏫 Teacher is teaching..."
            );

            teacherStage.classList.add(
                "teacherActive"
            );

            if (teacherVideo) {

                teacherVideo.muted = false;

                try {

                    await teacherVideo.play();

                } catch (error) {

                    /*
                     * Browser may block unmuted autoplay.
                     * Start muted instead.
                     */

                    teacherVideo.muted = true;

                    try {
                        await teacherVideo.play();
                    } catch (e) {
                        console.log(
                            "Video play blocked."
                        );
                    }
                }
            }

            const lessonText =
                document.getElementById(
                    "lessonText"
                );

            if (
                lessonText &&
                lessonText.textContent.trim()
            ) {

                speakText(
                    lessonText.textContent
                );
            }
        };


    /* ========================================================
       PAUSE TEACHER
       ======================================================== */

    window.pauseTeacher =
        function () {

            isRunning = false;

            setTeacherStatus(
                "⏸ Teacher paused"
            );

            teacherStage.classList.remove(
                "teacherActive"
            );

            if (teacherVideo) {
                teacherVideo.pause();
            }

            if (
                "speechSynthesis" in window
            ) {

                window.speechSynthesis.cancel();
            }
        };


    /* ========================================================
       TEACHER VOICE
       ======================================================== */

    window.speakLesson =
        function () {

            const lessonText =
                document.getElementById(
                    "lessonText"
                );

            if (!lessonText) {
                return;
            }

            const text =
                lessonText.textContent.trim();

            if (!text) {
                return;
            }

            speakText(text);
        };


    /* ========================================================
       SPEAK TEXT
       ======================================================== */

    function speakText(text) {

        if (
            !("speechSynthesis" in window)
        ) {

            alert(
                "Your browser does not support teacher voice."
            );

            return;
        }

        window.speechSynthesis.cancel();

        const speech =
            new SpeechSynthesisUtterance(
                text
            );

        speech.rate = 0.92;
        speech.pitch = 1.0;
        speech.volume = 1.0;

        speech.onstart =
            function () {

                setTeacherStatus(
                    "🗣️ Teacher is speaking..."
                );

                teacherStage.classList.add(
                    "teacherSpeaking"
                );
            };

        speech.onend =
            function () {

                teacherStage.classList.remove(
                    "teacherSpeaking"
                );

                if (isRunning) {

                    setTeacherStatus(
                        "👨‍🏫 Teacher is ready"
                    );

                }
            };

        speech.onerror =
            function () {

                teacherStage.classList.remove(
                    "teacherSpeaking"
                );
            };

        window.speechSynthesis.speak(
            speech
        );
    }


    /* ========================================================
       SHOW EXPLANATION
       ======================================================== */

    function showTeacherExplanation(
        text
    ) {

        if (teacherVoice) {

            teacherVoice.textContent =
                text;
        }

        /*
         * Put a short version on the smart board.
         */

        if (board) {

            board.innerHTML = `
                <div class="boardLesson">

                    <div class="boardTeacherWriting">
                        👨‍🏫 TEACHER
                    </div>

                    <h1>
                        ${escapeHTML(
                            getCurrentConcept()
                        )}
                    </h1>

                    <p>
                        ${escapeHTML(
                            text
                        )}
                    </p>

                </div>
            `;
        }

        /*
         * Automatically start the visual teacher
         * when lesson explanation arrives.
         */

        if (
            teacherVideo &&
            isRunning
        ) {

            teacherVideo.play()
                .catch(function () {});
        }
    }


    /* ========================================================
       CURRENT CONCEPT
       ======================================================== */

    function getCurrentConcept() {

        const title =
            document.getElementById(
                "conceptTitle"
            );

        if (
            title &&
            title.textContent.trim()
        ) {

            return title.textContent.trim();
        }

        return "Today's Lesson";
    }


    /* ========================================================
       STATUS
       ======================================================== */

    function setTeacherStatus(
        message
    ) {

        const status =
            document.getElementById(
                "teacherStatus"
            );

        if (status) {
            status.textContent =
                message;
        }
    }


    /* ========================================================
       HTML ESCAPE
       ======================================================== */

    function escapeHTML(
        value
    ) {

        return String(value)
            .replaceAll(
                "&",
                "&amp;"
            )
            .replaceAll(
                "<",
                "&lt;"
            )
            .replaceAll(
                ">",
                "&gt;"
            )
            .replaceAll(
                '"',
                "&quot;"
            )
            .replaceAll(
                "'",
                "&#039;"
            );
    }


    /* ========================================================
       TEACHER STYLES
       ======================================================== */

    function addTeacherStyles() {

        if (
            document.getElementById(
                "aiTeacherRuntimeStyles"
            )
        ) {

            return;
        }

        const style =
            document.createElement(
                "style"
            );

        style.id =
            "aiTeacherRuntimeStyles";

        style.textContent = `

        #humanAITeacher {
            width: 100%;
            margin: 20px 0;
            position: relative;
            z-index: 20;
        }

        .aiTeacherScene {
            width: 100%;
            min-height: 650px;
            border-radius: 24px;
            overflow: hidden;
            background:
                radial-gradient(
                    circle at 50% 30%,
                    #17395c 0%,
                    #071525 55%,
                    #020812 100%
                );
            box-shadow:
                0 25px 70px
                rgba(0,0,0,.45);
            position: relative;
        }

        /* SMART BOARD */

        .aiTeacherBoard {
            position: relative;
            width: 92%;
            height: 300px;
            margin: 25px auto 0;
            border: 10px solid #684829;
            border-radius: 14px;
            background: #06231e;
            box-shadow:
                inset 0 0 35px
                rgba(0,0,0,.75),
                0 15px 35px
                rgba(0,0,0,.4);
            overflow: hidden;
        }

        .boardTop {
            height: 38px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 16px;
            background: #061b18;
            color: #d9fff3;
            font-weight: 800;
            letter-spacing: 1px;
        }

        .liveIndicator {
            color: #62f5a3;
            font-size: 13px;
        }

        .boardContent {
            height: calc(100% - 38px);
            padding: 25px 35px;
            color: #f4fff9;
            overflow: hidden;
        }

        .boardContent h1 {
            font-size: 32px;
            margin: 5px 0 20px;
            color: #ffffff;
        }

        .boardContent p {
            font-size: 20px;
            line-height: 1.5;
            color: #d6e9e2;
        }

        .boardTeacherWriting {
            color: #6ee7a4;
            font-size: 15px;
            font-weight: 800;
            margin-bottom: 10px;
        }

        .boardLesson h1 {
            font-size: 30px;
            margin: 8px 0 15px;
        }

        /* TEACHER */

        .teacherArea {
            position: relative;
            width: 100%;
            height: 310px;
            display: flex;
            justify-content: center;
            align-items: flex-end;
            overflow: hidden;
        }

        .teacherGlow {
            position: absolute;
            width: 360px;
            height: 260px;
            bottom: 0;
            border-radius: 50%;
            background:
                radial-gradient(
                    circle,
                    rgba(65,170,255,.22),
                    transparent 70%
                );
            filter: blur(15px);
        }

        .teacherVideo {
            position: relative;
            z-index: 3;
            height: 300px;
            width: min(430px, 75%);
            object-fit: contain;
            border-radius: 20px 20px 0 0;
            background: transparent;
            transition:
                transform .35s ease,
                filter .35s ease;
        }

        /*
         * Small natural movement while teaching.
         */

        .teacherActive .teacherVideo {
            animation:
                teacherBreathing
                4s ease-in-out infinite;
        }

        .teacherSpeaking .teacherVideo {
            animation:
                teacherSpeakingMove
                1.8s ease-in-out infinite;
        }

        @keyframes teacherBreathing {

            0%,100% {
                transform:
                    translateY(0px)
                    scale(1);
            }

            50% {
                transform:
                    translateY(-5px)
                    scale(1.01);
            }
        }

        @keyframes teacherSpeakingMove {

            0%,100% {
                transform:
                    translateY(0px)
                    rotate(0deg);
            }

            25% {
                transform:
                    translateY(-3px)
                    rotate(-0.4deg);
            }

            75% {
                transform:
                    translateY(-2px)
                    rotate(0.4deg);
            }
        }

        .teacherStatus {
            position: absolute;
            z-index: 10;
            bottom: 15px;
            left: 50%;
            transform:
                translateX(-50%);
            padding: 9px 18px;
            border-radius: 999px;
            background:
                rgba(3,12,23,.85);
            border:
                1px solid
                rgba(100,200,255,.35);
            color: #ffffff;
            font-weight: 700;
            backdrop-filter: blur(8px);
        }

        /* SPEECH */

        .teacherSpeechBox {
            width: 92%;
            margin: 0 auto 22px;
            padding: 20px 24px;
            border-radius: 16px;
            background:
                rgba(4,18,32,.9);
            border:
                1px solid
                rgba(80,180,255,.25);
        }

        .speechHeader {
            color: #65d7ff;
            font-weight: 800;
            margin-bottom: 10px;
        }

        .speechText {
            color: #edf8ff;
            font-size: 18px;
            line-height: 1.6;
            min-height: 45px;
        }

        @media(max-width:700px) {

            .aiTeacherBoard {
                height: 250px;
            }

            .boardContent h1 {
                font-size: 23px;
            }

            .boardContent p {
                font-size: 16px;
            }

            .teacherArea {
                height: 260px;
            }

            .teacherVideo {
                height: 250px;
            }

            .speechText {
                font-size: 15px;
            }
        }

        `;

        document.head.appendChild(style);
    }


    /* ========================================================
       PAGE READY
       ======================================================== */

    if (
        document.readyState ===
        "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initTeacher
        );

    } else {

        initTeacher();
    }

})();

