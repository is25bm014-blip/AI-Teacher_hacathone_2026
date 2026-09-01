// ============================================================
// AI TEACHER STUDIO
// ONE-FILE ANIMATED TEACHER ENGINE
// Replace your existing static/app.js with this file.
// ============================================================


// ============================================================
// GLOBAL STATE
// ============================================================

const state = {

    learnerId: null,
    lessonId: null,

    topic: "",
    plan: null,

    currentStep: 0,
    currentTeaching: null,

    assessment: null,
    interactions: [],

    classStarted: false,
    teacherSpeaking: false,
    paused: false,

    speechTimer: null,
    animationTimer: null

};


// ============================================================
// BASIC HELPERS
// ============================================================

function $(id) {
    return document.getElementById(id);
}


async function apiRequest(url, options = {}) {

    const response = await fetch(url, options);

    let data = {};

    try {
        data = await response.json();
    } catch {
        data = {};
    }

    if (!response.ok) {

        throw new Error(
            data.error || "Request failed."
        );

    }

    return data;

}


async function postJSON(url, data) {

    return apiRequest(
        url,
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(data)
        }
    );

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }

    return String(value)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// ============================================================
// INJECT ANIMATION CSS
// This allows us to change ONLY app.js.
// ============================================================

function injectTeacherCSS() {

    if ($("aiTeacherAnimationCSS")) {
        return;
    }

    const style = document.createElement("style");

    style.id = "aiTeacherAnimationCSS";

    style.textContent = `

    /* =====================================================
       CLASSROOM
       ===================================================== */

    .ai-classroom {

        position: relative;

        width: 100%;

        min-height: 620px;

        margin-top: 25px;

        overflow: hidden;

        border-radius: 22px;

        background:
            linear-gradient(
                180deg,
                #08111d 0%,
                #0a1726 55%,
                #07111d 100%
            );

        border: 1px solid #294966;

        box-shadow:
            inset 0 0 80px rgba(0,0,0,.35),
            0 20px 60px rgba(0,0,0,.25);

    }


    /* =====================================================
       SMART BOARD
       ===================================================== */

    .ai-board {

        position: absolute;

        top: 25px;

        left: 4%;

        width: 92%;

        height: 310px;

        background: #061c18;

        border:
            8px solid #503923;

        border-radius: 8px;

        box-shadow:
            0 12px 35px rgba(0,0,0,.5),
            inset 0 0 25px rgba(0,0,0,.4);

    }


    .ai-board-title {

        position: absolute;

        top: 8px;

        left: 15px;

        font-size: 14px;

        font-weight: 900;

        letter-spacing: 1px;

        color: #d9fff2;

    }


    .ai-live {

        position: absolute;

        right: 15px;

        top: 8px;

        color: #72ffab;

        font-size: 12px;

        font-weight: 900;

    }


    .ai-board-canvas {

        position: absolute;

        left: 0;

        top: 32px;

        width: 100%;

        height: calc(100% - 32px);

    }


    /* =====================================================
       BOARD WRITING
       ===================================================== */

    .ai-board-writing {

        position: absolute;

        left: 35px;

        top: 58px;

        width: 80%;

        color: #f1fff8;

        font-size: 28px;

        line-height: 1.45;

        font-family:
            "Segoe Print",
            "Comic Sans MS",
            cursive;

        text-shadow:
            0 0 4px rgba(255,255,255,.25);

        white-space: pre-wrap;

        opacity: 0;

        transition:
            opacity .3s ease;

    }


    .ai-board-writing.show {

        opacity: 1;

    }


    .ai-board-cursor {

        display: inline-block;

        width: 3px;

        height: 30px;

        background: #fff;

        margin-left: 3px;

        vertical-align: middle;

        animation:
            cursorBlink .7s infinite;

    }


    @keyframes cursorBlink {

        0%, 50% {
            opacity: 1;
        }

        51%, 100% {
            opacity: 0;
        }

    }


    /* =====================================================
       TEACHER STAGE
       ===================================================== */

    .ai-teacher-stage {

        position: absolute;

        left: 50%;

        bottom: 0;

        width: 330px;

        height: 320px;

        transform:
            translateX(-50%);

        transition:
            left 1.2s cubic-bezier(.2,.8,.2,1),
            transform 1.2s ease;

        z-index: 5;

    }


    .ai-teacher-stage.at-board {

        left: 78%;

        transform:
            translateX(-50%)
            scale(.88);

    }


    /* =====================================================
       TEACHER BODY
       ===================================================== */

    .ai-human {

        position: absolute;

        left: 50%;

        bottom: 0;

        width: 250px;

        height: 300px;

        transform:
            translateX(-50%);

    }


    /* HEAD */

    .ai-head {

        position: absolute;

        left: 72px;

        top: 5px;

        width: 108px;

        height: 125px;

        background:
            linear-gradient(
                145deg,
                #ffd7bb,
                #eeb697
            );

        border-radius:
            48% 48% 45% 45%;

        z-index: 4;

        box-shadow:
            0 8px 15px rgba(0,0,0,.2);

    }


    /* HAIR */

    .ai-hair {

        position: absolute;

        left: 66px;

        top: 0;

        width: 120px;

        height: 52px;

        background:
            linear-gradient(
                135deg,
                #111827,
                #020617
            );

        border-radius:
            60px 60px 20px 20px;

        z-index: 6;

    }


    /* HAIR SIDE */

    .ai-hair-side {

        position: absolute;

        left: 66px;

        top: 25px;

        width: 25px;

        height: 45px;

        background: #050914;

        border-radius: 20px;

        z-index: 7;

    }


    /* EYES */

    .ai-eye {

        position: absolute;

        top: 57px;

        width: 10px;

        height: 10px;

        background: #172033;

        border-radius: 50%;

        z-index: 8;

        transition:
            transform .1s;

    }


    .ai-eye.left {

        left: 91px;

    }


    .ai-eye.right {

        left: 145px;

    }


    /* BLINK */

    .ai-human.blink
    .ai-eye {

        transform:
            scaleY(.08);

    }


    /* NOSE */

    .ai-nose {

        position: absolute;

        left: 119px;

        top: 68px;

        width: 8px;

        height: 24px;

        border-right:
            2px solid rgba(120,70,60,.35);

        border-radius: 50%;

        z-index: 8;

    }


    /* MOUTH */

    .ai-mouth {

        position: absolute;

        left: 106px;

        top: 96px;

        width: 38px;

        height: 13px;

        border-bottom:
            3px solid #8e4052;

        border-radius: 0 0 50% 50%;

        z-index: 8;

    }


    /* TALKING */

    .ai-human.talking
    .ai-mouth {

        animation:
            mouthTalk .18s infinite alternate;

    }


    @keyframes mouthTalk {

        from {

            height: 5px;

        }

        to {

            height: 17px;

        }

    }


    /* BODY */

    .ai-body {

        position: absolute;

        left: 47px;

        top: 118px;

        width: 158px;

        height: 175px;

        background:
            linear-gradient(
                145deg,
                #234e77,
                #122f4d
            );

        border-radius:
            65px 65px 20px 20px;

        z-index: 2;

        box-shadow:
            0 10px 20px rgba(0,0,0,.25);

    }


    /* SHIRT */

    .ai-shirt-line {

        position: absolute;

        left: 126px;

        top: 120px;

        width: 2px;

        height: 168px;

        background:
            rgba(255,255,255,.15);

        z-index: 4;

    }


    /* LEFT ARM */

    .ai-arm-left {

        position: absolute;

        left: 25px;

        top: 135px;

        width: 38px;

        height: 145px;

        background:
            linear-gradient(
                180deg,
                #1c466d,
                #102e4c
            );

        border-radius: 30px;

        transform:
            rotate(20deg);

        transform-origin:
            top center;

        z-index: 1;

        transition:
            transform .8s ease;

    }


    /* RIGHT ARM */

    .ai-arm-right {

        position: absolute;

        left: 188px;

        top: 135px;

        width: 38px;

        height: 145px;

        background:
            linear-gradient(
                180deg,
                #1c466d,
                #102e4c
            );

        border-radius: 30px;

        transform:
            rotate(-20deg);

        transform-origin:
            top center;

        z-index: 1;

        transition:
            transform .8s ease;

    }


    /* HANDS */

    .ai-hand {

        position: absolute;

        width: 39px;

        height: 39px;

        border-radius: 50%;

        background: #efb899;

        z-index: 6;

    }


    .ai-hand-left {

        left: 12px;

        top: 258px;

    }


    .ai-hand-right {

        left: 199px;

        top: 258px;

    }


    /* POINTING */

    .ai-teacher-stage.pointing
    .ai-arm-right {

        transform:
            rotate(-62deg);

    }


    .ai-teacher-stage.pointing
    .ai-hand-right {

        transform:
            translate(48px,-72px);

    }


    /* WRITING */

    .ai-teacher-stage.writing
    .ai-arm-right {

        transform:
            rotate(-72deg);

    }


    .ai-teacher-stage.writing
    .ai-hand-right {

        transform:
            translate(70px,-115px);

    }


    /* =====================================================
       LAPTOP / DESK
       ===================================================== */

    .ai-desk {

        position: absolute;

        left: 15px;

        bottom: -5px;

        width: 300px;

        height: 35px;

        background:
            linear-gradient(
                180deg,
                #142b43,
                #091a2c
            );

        border-radius: 15px 15px 5px 5px;

        z-index: 7;

        box-shadow:
            0 -5px 20px rgba(0,0,0,.3);

    }


    .ai-laptop {

        position: absolute;

        left: 105px;

        bottom: 25px;

        width: 90px;

        height: 55px;

        background: #071525;

        border:
            4px solid #24445f;

        border-radius: 7px;

        z-index: 8;

        display: flex;

        align-items: center;

        justify-content: center;

        color: #6ee7ff;

        font-weight: 900;

    }


    /* =====================================================
       TALKING STATUS
       ===================================================== */

    .ai-speaking-label {

        position: absolute;

        left: 50%;

        bottom: 18px;

        transform:
            translateX(-50%);

        padding: 8px 15px;

        border-radius: 20px;

        background:
            rgba(5,15,27,.9);

        border:
            1px solid #315777;

        color: #72ffab;

        font-size: 12px;

        font-weight: 800;

        z-index: 20;

        opacity: 0;

        transition:
            opacity .25s ease;

    }


    .ai-speaking-label.show {

        opacity: 1;

    }


    /* =====================================================
       MOVING DOTS / CLASSROOM EFFECT
       ===================================================== */

    .ai-light {

        position: absolute;

        width: 160px;

        height: 160px;

        border-radius: 50%;

        background:
            radial-gradient(
                circle,
                rgba(110,231,255,.12),
                transparent 70%
            );

        animation:
            classroomLight 5s infinite alternate;

    }


    .ai-light.one {

        left: 5%;

        top: 45%;

    }


    .ai-light.two {

        right: 5%;

        top: 40%;

        animation-delay:
            1.5s;

    }


    @keyframes classroomLight {

        from {

            transform:
                translate(0,0);

        }

        to {

            transform:
                translate(40px,-20px);

        }

    }


    /* =====================================================
       CONTROLS
       ===================================================== */

    .ai-class-controls {

        display: flex;

        flex-wrap: wrap;

        gap: 8px;

        margin-top: 12px;

    }


    .ai-class-controls button {

        min-width: 130px;

    }


    /* MOBILE */

    @media(max-width:700px) {

        .ai-classroom {

            min-height: 570px;

        }

        .ai-board {

            height: 250px;

        }

        .ai-board-writing {

            font-size: 19px;

            left: 20px;

        }

        .ai-teacher-stage {

            transform:
                translateX(-50%)
                scale(.78);

        }

        .ai-teacher-stage.at-board {

            left: 75%;

        }

    }

    `;

    document.head.appendChild(style);

}


// ============================================================
// CREATE THE ANIMATED TEACHER
// ============================================================

function createAnimatedTeacher() {

    injectTeacherCSS();

    const teacherCard =
        document.querySelector(".teacherCard");

    if (!teacherCard) {
        return;
    }

    // Do not create twice
    if ($("aiClassroom")) {
        return;
    }

    const classroom =
        document.createElement("div");

    classroom.id =
        "aiClassroom";

    classroom.className =
        "ai-classroom";

    classroom.innerHTML = `

        <div class="ai-light one"></div>
        <div class="ai-light two"></div>

        <!-- SMART BOARD -->

        <div class="ai-board">

            <div class="ai-board-title">
                AI SMART BOARD
            </div>

            <div class="ai-live">
                ● LIVE
            </div>

            <div
                id="aiBoardWriting"
                class="ai-board-writing"
            ></div>

        </div>


        <!-- TEACHER -->

        <div
            id="aiTeacherStage"
            class="ai-teacher-stage"
        >

            <div class="ai-human">

                <div class="ai-hair"></div>

                <div class="ai-hair-side"></div>

                <div class="ai-head"></div>

                <div class="ai-eye left"></div>
                <div class="ai-eye right"></div>

                <div class="ai-nose"></div>

                <div class="ai-mouth"></div>

                <div class="ai-body"></div>

                <div class="ai-shirt-line"></div>

                <div class="ai-arm-left"></div>
                <div class="ai-arm-right"></div>

                <div
                    class="ai-hand ai-hand-left"
                ></div>

                <div
                    class="ai-hand ai-hand-right"
                ></div>

            </div>

            <div class="ai-desk"></div>

            <div class="ai-laptop">
                AI
            </div>

        </div>


        <div
            id="aiSpeakingLabel"
            class="ai-speaking-label"
        >
            🎙 Teacher is explaining...
        </div>

    `;


    /*
       Put animation stage at the beginning
       of teacher card.
    */

    teacherCard.insertBefore(
        classroom,
        teacherCard.firstChild
    );


    // Create extra controls
    createTeacherControls();

}


// ============================================================
// TEACHER CONTROLS
// ============================================================

function createTeacherControls() {

    const teacherCard =
        document.querySelector(".teacherCard");

    if (!teacherCard) {
        return;
    }

    if ($("aiClassControls")) {
        return;
    }

    const controls =
        document.createElement("div");

    controls.id =
        "aiClassControls";

    controls.className =
        "ai-class-controls";

    controls.innerHTML = `

        <button
            id="startClassButton"
            type="button"
        >
            ▶ Start Class
        </button>

        <button
            id="pauseClassButton"
            type="button"
        >
            ⏸ Pause
        </button>

        <button
            id="teacherVoiceButton"
            type="button"
        >
            🔊 Teacher Voice
        </button>

        <button
            id="writeBoardButton"
            type="button"
        >
            ✍ Write on Board
        </button>

    `;

    teacherCard.appendChild(
        controls
    );


    $("startClassButton")
        .addEventListener(
            "click",
            startClass
        );


    $("pauseClassButton")
        .addEventListener(
            "click",
            pauseClass
        );


    $("teacherVoiceButton")
        .addEventListener(
            "click",
            speakLesson
        );


    $("writeBoardButton")
        .addEventListener(
            "click",
            () => {

                if (state.currentTeaching) {

                    animateTeacherToBoard();

                    writeBoard(
                        getBoardText()
                    );

                }

            }
        );

}


// ============================================================
// START CLASS
// ============================================================

async function startClass() {

    state.classStarted =
        true;

    state.paused =
        false;

    if (!state.plan) {

        alert(
            "Create learner and generate a lesson first."
        );

        return;

    }

    if (state.currentStep === 0) {

        await nextStep();

    } else {

        speakLesson();

    }

}


// ============================================================
// PAUSE
// ============================================================

function pauseClass() {

    state.paused =
        !state.paused;

    if (state.paused) {

        window.speechSynthesis.pause();

        stopTeacherAnimation();

        if ($("pauseClassButton")) {

            $("pauseClassButton")
                .textContent =
                "▶ Resume";

        }

    } else {

        window.speechSynthesis.resume();

        if ($("pauseClassButton")) {

            $("pauseClassButton")
                .textContent =
                "⏸ Pause";

        }

        teacherTalkingAnimation();

    }

}


// ============================================================
// SERVER STATUS
// ============================================================

async function checkServer() {

    try {

        const data =
            await apiRequest("/health");

        if ($("serverStatus")) {

            if (data.ai_enabled) {

                $("serverStatus").textContent =
                    "● AI Online";

            } else {

                $("serverStatus").textContent =
                    "● Demo Mode — Add API Key";

            }

        }

    } catch {

        if ($("serverStatus")) {

            $("serverStatus").textContent =
                "● Server Error";

        }

    }

}


// ============================================================
// CREATE LEARNER
// ============================================================

async function createLearner() {

    try {

        const data =
            await postJSON(
                "/api/learner",
                {

                    name:
                        $("studentName").value,

                    level:
                        $("level").value,

                    language:
                        $("language").value,

                    teaching_style:
                        $("teachingStyle").value,

                    objective:
                        $("objective").value

                }
            );

        state.learnerId =
            data.learner_id;

        $("learnerStatus").textContent =
            `✓ Learner #${data.learner_id} created`;

    } catch (error) {

        alert(error.message);

    }

}


// ============================================================
// UPLOAD MATERIAL
// ============================================================

async function uploadMaterial() {

    if (!state.learnerId) {

        alert(
            "Please create the learner profile first."
        );

        return;

    }

    const file =
        $("learningFile").files[0];

    if (!file) {

        alert(
            "Please choose a file."
        );

        return;

    }

    const formData =
        new FormData();

    formData.append(
        "learner_id",
        state.learnerId
    );

    formData.append(
        "file",
        file
    );

    try {

        const data =
            await apiRequest(
                "/api/upload",
                {
                    method: "POST",
                    body: formData
                }
            );

        $("uploadStatus").innerHTML = `

            <div class="step">

                <strong>
                    ✓ Material processed
                </strong>

                <br>

                File:
                ${escapeHTML(data.filename)}

                <br>

                Text:
                ${data.characters.toLocaleString()}
                characters

                <br>

                RAG chunks:
                ${data.chunks}

            </div>

        `;

    } catch (error) {

        alert(error.message);

    }

}


// ============================================================
// GENERATE LESSON
// ============================================================

async function generatePlan() {

    if (!state.learnerId) {

        alert(
            "Please create the learner profile first."
        );

        return;

    }

    const topic =
        $("topic").value.trim();

    if (!topic) {

        alert(
            "Please enter a topic."
        );

        return;

    }

    try {

        const data =
            await postJSON(
                "/api/plan",
                {

                    learner_id:
                        state.learnerId,

                    topic:
                        topic,

                    minutes:
                        Number(
                            $("minutes").value
                        )

                }
            );

        state.lessonId =
            data.lesson_id;

        state.topic =
            data.topic;

        state.plan =
            data.plan;

        state.currentStep =
            0;

        state.classStarted =
            false;

        renderPlan();

        clearBoard();

        $("conceptTitle").textContent =
            state.plan.title ||
            state.topic;

        $("progressText").textContent =
            "Your AI teacher is ready.";

        writeBoard(
            `${state.plan.title || state.topic}\n\nLet's learn this step by step.`
        );

    } catch (error) {

        alert(error.message);

    }

}


// ============================================================
// DISPLAY LESSON PLAN
// ============================================================

function renderPlan() {

    const plan =
        state.plan;

    let html = "";

    html += `
        <h3>
            ${escapeHTML(
                plan.title ||
                state.topic
            )}
        </h3>
    `;

    html += `
        <p>
            ${escapeHTML(
                plan.objective ||
                ""
            )}
        </p>
    `;

    if (Array.isArray(plan.steps)) {

        plan.steps.forEach(
            (step, index) => {

                html += `
                    <div class="step">

                        <strong>
                            ${index + 1}.
                            ${escapeHTML(
                                step.title
                            )}
                        </strong>

                        <br>

                        ${step.minutes || 1}
                        minute(s)

                    </div>
                `;

            }
        );

    }

    $("plan").innerHTML =
        html;

}


// ============================================================
// NEXT TEACHING STEP
// ============================================================

async function nextStep() {

    if (!state.plan) {

        alert(
            "Generate a lesson first."
        );

        return;

    }

    const steps =
        state.plan.steps || [];

    if (
        state.currentStep >=
        steps.length
    ) {

        $("conceptTitle").textContent =
            "Lesson complete";

        $("progressText").textContent =
            "Let's check your final understanding.";

        stopTeacherAnimation();

        await generateAssessment();

        return;

    }

    const step =
        steps[state.currentStep];

    state.currentStep++;

    $("conceptTitle").textContent =
        step.title;

    $("progressText").textContent =
        `Teaching step ${state.currentStep} of ${steps.length}`;

    $("lessonText").textContent =
        "AI teacher is preparing the explanation...";

    $("questionPanel")
        .classList
        .add("hidden");


    // Teacher comes to center first
    moveTeacherToCenter();


    try {

        const data =
            await postJSON(
                "/api/teach",
                {

                    learner_id:
                        state.learnerId,

                    lesson_id:
                        state.lessonId,

                    concept:
                        step.title

                }
            );

        state.currentTeaching =
            data;

        step.question =
            data.question.question;

        step.expected =
            data.question.expected;

        $("lessonText").textContent =
            data.explanation;


        // Update board
        clearBoard();

        setTimeout(
            () => {

                writeBoard(
                    getBoardText()
                );

            },
            500
        );


        $("visualBox").innerHTML = `

            <strong>
                🎓 Subject-aware visual
            </strong>

            <p>
                ${escapeHTML(
                    state.plan.visual ||
                    "Teacher uses the smart board to explain the concept."
                )}
            </p>

        `;


        $("questionText").textContent =
            data.question.question;

        $("studentAnswer").value =
            "";

        $("feedback").innerHTML =
            "";


        $("questionPanel")
            .classList
            .remove("hidden");


        // Teacher talks
        setTimeout(
            () => {

                speakLesson();

            },
            700
        );


    } catch (error) {

        $("lessonText").textContent =
            error.message;

    }

}


// ============================================================
// GET BOARD TEXT
// ============================================================

function getBoardText() {

    if (!state.currentTeaching) {

        return state.topic ||
            "Welcome to AI Teacher";

    }

    const title =
        state.plan?.steps?.[
            state.currentStep - 1
        ]?.title ||
        state.topic;

    let explanation =
        state.currentTeaching.explanation ||
        "";

    // Keep board readable
    explanation =
        explanation
            .replace(/\n+/g, " ")
            .trim();

    if (explanation.length > 230) {

        explanation =
            explanation.substring(
                0,
                230
            ) + "...";

    }

    return `${title}\n\n${explanation}`;

}


// ============================================================
// WRITE ON BOARD
// ============================================================

function writeBoard(text) {

    const board =
        $("aiBoardWriting");

    if (!board) {
        return;
    }

    board.classList.remove("show");

    board.innerHTML = "";

    animateTeacherToBoard();

    const cursor =
        document.createElement("span");

    cursor.className =
        "ai-board-cursor";

    board.appendChild(cursor);

    board.classList.add("show");

    const chars =
        String(text).split("");

    let index = 0;

    clearInterval(
        state.animationTimer
    );

    state.animationTimer =
        setInterval(
            () => {

                if (state.paused) {
                    return;
                }

                if (index >= chars.length) {

                    clearInterval(
                        state.animationTimer
                    );

                    setTimeout(
                        () => {

                            moveTeacherToCenter();

                        },
                        1200
                    );

                    return;

                }

                cursor.before(
                    document.createTextNode(
                        chars[index]
                    )
                );

                index++;

            },
            15
        );

}


// ============================================================
// CLEAR BOARD
// ============================================================

function clearBoard() {

    const board =
        $("aiBoardWriting");

    if (!board) {
        return;
    }

    board.classList.remove("show");

    board.innerHTML = "";

}


// ============================================================
// MOVE TEACHER TO BOARD
// ============================================================

function animateTeacherToBoard() {

    const stage =
        $("aiTeacherStage");

    if (!stage) {
        return;
    }

    stage.classList.remove(
        "pointing"
    );

    stage.classList.add(
        "at-board",
        "writing"
    );

}


// ============================================================
// MOVE TEACHER TO CENTER
// ============================================================

function moveTeacherToCenter() {

    const stage =
        $("aiTeacherStage");

    if (!stage) {
        return;
    }

    stage.classList.remove(
        "at-board",
        "writing"
    );

    stage.classList.add(
        "pointing"
    );

    setTimeout(
        () => {

            stage.classList.remove(
                "pointing"
            );

        },
        1400
    );

}


// ============================================================
// TEACHER TALKING ANIMATION
// ============================================================

function teacherTalkingAnimation() {

    const stage =
        $("aiTeacherStage");

    const human =
        stage?.querySelector(
            ".ai-human"
        );

    if (!human) {
        return;
    }

    human.classList.add(
        "talking"
    );

    state.teacherSpeaking =
        true;

}


// ============================================================
// STOP TEACHER ANIMATION
// ============================================================

function stopTeacherAnimation() {

    const stage =
        $("aiTeacherStage");

    const human =
        stage?.querySelector(
            ".ai-human"
        );

    if (!human) {
        return;
    }

    human.classList.remove(
        "talking"
    );

    state.teacherSpeaking =
        false;

    if ($("aiSpeakingLabel")) {

        $("aiSpeakingLabel")
            .classList
            .remove("show");

    }

}


// ============================================================
// SPEECH
// ============================================================

function speakLesson() {

    if (
        !("speechSynthesis" in window)
    ) {

        alert(
            "Your browser does not support speech synthesis."
        );

        return;

    }

    const text =
        $("lessonText")?.textContent;

    if (!text) {
        return;
    }

    window.speechSynthesis.cancel();

    clearTimeout(
        state.speechTimer
    );

    const utterance =
        new SpeechSynthesisUtterance(
            text
        );


    // Select voice according to language
    const language =
        $("language")?.value ||
        "English";

    const voices =
        window.speechSynthesis
            .getVoices();

    if (language === "Hindi") {

        const hindiVoice =
            voices.find(
                voice =>
                    voice.lang
                        .toLowerCase()
                        .startsWith("hi")
            );

        if (hindiVoice) {

            utterance.voice =
                hindiVoice;

            utterance.lang =
                "hi-IN";

        }

    } else {

        const englishVoice =
            voices.find(
                voice =>
                    voice.lang
                        .toLowerCase()
                        .startsWith("en")
            );

        if (englishVoice) {

            utterance.voice =
                englishVoice;

        }

        utterance.lang =
            "en-US";

    }


    utterance.rate =
        0.92;

    utterance.pitch =
        1.0;


    utterance.onstart =
        () => {

            state.teacherSpeaking =
                true;

            teacherTalkingAnimation();

            if ($("aiSpeakingLabel")) {

                $("aiSpeakingLabel")
                    .classList
                    .add("show");

            }

            moveTeacherToCenter();

        };


    utterance.onend =
        () => {

            stopTeacherAnimation();

            if ($("aiSpeakingLabel")) {

                $("aiSpeakingLabel")
                    .classList
                    .remove("show");

            }

            // After explanation,
            // teacher points toward board.
            setTimeout(
                () => {

                    const stage =
                        $("aiTeacherStage");

                    if (stage) {

                        stage.classList.add(
                            "pointing"
                        );

                    }

                },
                300
            );

        };


    utterance.onerror =
        () => {

            stopTeacherAnimation();

        };


    window.speechSynthesis.speak(
        utterance
    );

}


// ============================================================
// BLINKING
// ============================================================

function startBlinking() {

    setInterval(
        () => {

            const stage =
                $("aiTeacherStage");

            const human =
                stage?.querySelector(
                    ".ai-human"
                );

            if (!human) {
                return;
            }

            human.classList.add(
                "blink"
            );

            setTimeout(
                () => {

                    human.classList.remove(
                        "blink"
                    );

                },
                140
            );

        },
        3200
    );

}


// ============================================================
// IDLE BODY MOVEMENT
// ============================================================

function startIdleMovement() {

    setInterval(
        () => {

            if (
                state.paused ||
                state.teacherSpeaking
            ) {
                return;
            }

            const human =
                document.querySelector(
                    ".ai-human"
                );

            if (!human) {
                return;
            }

            human.animate(
                [
                    {
                        transform:
                            "translateX(-50%) translateY(0)"
                    },

                    {
                        transform:
                            "translateX(-50%) translateY(-4px)"
                    },

                    {
                        transform:
                            "translateX(-50%) translateY(0)"
                    }

                ],
                {
                    duration: 1800,
                    easing: "ease-in-out"
                }
            );

        },
        2200
    );

}


// ============================================================
// EVALUATE ANSWER
// ============================================================

async function evaluateAnswer() {

    if (!state.currentTeaching) {
        return;
    }

    const step =
        state.plan.steps[
            state.currentStep - 1
        ];

    const answer =
        $("studentAnswer").value;

    if (!answer.trim()) {

        alert(
            "Please write an answer first."
        );

        return;

    }

    try {

        const data =
            await postJSON(
                "/api/evaluate",
                {

                    learner_id:
                        state.learnerId,

                    lesson_id:
                        state.lessonId,

                    topic:
                        state.topic,

                    concept:
                        step.title,

                    question:
                        step.question,

                    answer:
                        answer,

                    expected:
                        step.expected

                }
            );


        state.interactions.push(
            data
        );


        let html = "";


        if (data.correct) {

            html += `
                <strong
                    style="color:#6ee7a4"
                >
                    ✓ Good understanding
                </strong>
            `;

        } else {

            html += `
                <strong
                    style="color:#ff8da0"
                >
                    Let's improve this concept
                </strong>
            `;

        }


        html += `
            <p>
                ${escapeHTML(
                    data.feedback || ""
                )}
            </p>
        `;


        if (data.misconception) {

            html += `
                <p>

                    <strong>
                        Detected misconception:
                    </strong>

                    ${escapeHTML(
                        data.misconception
                    )}

                </p>
            `;

        }


        html += `
            <p>

                <strong>
                    Teacher adaptation:
                </strong>

                ${escapeHTML(
                    data.adaptation ||
                    "continue"
                )}

            </p>
        `;


        if (data.difficulty) {

            html += `
                <p>

                    <strong>
                        Difficulty:
                    </strong>

                    ${escapeHTML(
                        data.difficulty
                    )}

                </p>
            `;

        }


        if (data.re_explanation) {

            html += `
                <div class="step">

                    <strong>
                        Teacher re-explanation:
                    </strong>

                    <br><br>

                    ${escapeHTML(
                        data.re_explanation
                    )}

                </div>
            `;

        }


        $("feedback").innerHTML =
            html;


        // Teacher reacts to answer

        if (data.correct) {

            moveTeacherToCenter();

            setTimeout(
                () => {

                    speakText(
                        "Excellent. You understood this concept."
                    );

                },
                300
            );

        } else {

            moveTeacherToCenter();

            if (data.re_explanation) {

                $("lessonText").textContent =
                    data.re_explanation;

                clearBoard();

                setTimeout(
                    () => {

                        writeBoard(
                            data.re_explanation
                        );

                    },
                    400
                );

                setTimeout(
                    () => {

                        speakText(
                            data.re_explanation
                        );

                    },
                    800
                );

            }

        }


    } catch (error) {

        alert(error.message);

    }

}


// ============================================================
// SPEAK ARBITRARY TEXT
// ============================================================

function speakText(text) {

    if (
        !("speechSynthesis" in window)
    ) {
        return;
    }

    window.speechSynthesis.cancel();

    const utterance =
        new SpeechSynthesisUtterance(
            text
        );

    utterance.rate =
        0.92;

    utterance.pitch =
        1.0;

    utterance.onstart =
        () => {

            teacherTalkingAnimation();

            if ($("aiSpeakingLabel")) {

                $("aiSpeakingLabel")
                    .classList
                    .add("show");

            }

        };

    utterance.onend =
        () => {

            stopTeacherAnimation();

            if ($("aiSpeakingLabel")) {

                $("aiSpeakingLabel")
                    .classList
                    .remove("show");

            }

        };

    window.speechSynthesis.speak(
        utterance
    );

}


// ============================================================
// FINAL ASSESSMENT
// ============================================================

async function generateAssessment() {

    if (!state.lessonId) {

        alert(
            "Please generate a lesson first."
        );

        return;

    }

    try {

        const data =
            await postJSON(
                "/api/assessment",
                {

                    learner_id:
                        state.learnerId,

                    lesson_id:
                        state.lessonId

                }
            );

        state.assessment =
            data;

        let html = "";

        const questions =
            data.questions || [];


        questions.forEach(
            (question, index) => {

                html += `
                    <div class="step">

                        <strong>
                            Q${index + 1}.
                            ${escapeHTML(
                                question.q
                            )}
                        </strong>

                        <textarea
                            id="assessment_${index}"
                            placeholder="Write your answer..."
                        ></textarea>

                    </div>
                `;

            }
        );


        $("assessment").innerHTML =
            html;


        $("finishAssessmentButton")
            .classList
            .remove("hidden");


    } catch (error) {

        alert(error.message);

    }

}


// ============================================================
// FINISH ASSESSMENT
// ============================================================

async function finishAssessment() {

    if (!state.assessment) {
        return;
    }

    const questions =
        state.assessment.questions ||
        [];

    let answered = 0;


    questions.forEach(
        (_, index) => {

            const input =
                document.getElementById(
                    `assessment_${index}`
                );

            if (
                input &&
                input.value.trim()
            ) {

                answered++;

            }

        }
    );


    const score =
        Math.round(
            (
                answered /
                Math.max(
                    1,
                    questions.length
                )
            ) * 100
        );


    const strong = [];

    const weak = [];


    state.interactions.forEach(
        (interaction, index) => {

            if (interaction.correct) {

                strong.push(
                    `Checkpoint ${index + 1}`
                );

            } else {

                weak.push(
                    `Checkpoint ${index + 1}`
                );

            }

        }
    );


    let recommendation;


    if (score >= 80) {

        recommendation =
            "Excellent understanding. Continue to the next concept and try harder problems.";

    } else if (score >= 50) {

        recommendation =
            "Review the weak concepts and complete additional practice questions.";

    } else {

        recommendation =
            "Re-teach the core concepts using simpler examples before advancing.";

    }


    try {

        await postJSON(
            "/api/report",
            {

                learner_id:
                    state.learnerId,

                lesson_id:
                    state.lessonId,

                topic:
                    state.topic,

                score:
                    score,

                strong:
                    strong,

                weak:
                    weak,

                recommendation:
                    recommendation

            }
        );


        $("score").textContent =
            `${score}%`;

        $("strongAreas").textContent =
            strong.length
                ? strong.join(", ")
                : "Review all concepts";

        $("weakAreas").textContent =
            weak.length
                ? weak.join(", ")
                : "No major weak checkpoint detected";

        $("nextStep").textContent =
            recommendation;


        speakText(
            `Your final score is ${score} percent. ${recommendation}`
        );


        window.scrollTo(
            {
                top:
                    document.body.scrollHeight,

                behavior:
                    "smooth"
            }
        );


    } catch (error) {

        alert(error.message);

    }

}


// ============================================================
// HISTORY
// ============================================================

async function loadHistory() {

    if (!state.learnerId) {

        alert(
            "Create a learner first."
        );

        return;

    }

    try {

        const data =
            await apiRequest(
                `/api/profile/${state.learnerId}`
            );

        $("history").textContent =
            JSON.stringify(
                data,
                null,
                2
            );

    } catch (error) {

        alert(error.message);

    }

}


// ============================================================
// INITIALIZE
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        createAnimatedTeacher();

        startBlinking();

        startIdleMovement();

        checkServer();

    }
);


// In case script loads after DOM
if (
    document.readyState ===
    "complete" ||
    document.readyState ===
    "interactive"
) {

    setTimeout(
        () => {

            createAnimatedTeacher();

            startBlinking();

            startIdleMovement();

            checkServer();

        },
        100
    );

}







