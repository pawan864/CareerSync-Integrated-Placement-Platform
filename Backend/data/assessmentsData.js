/**
 * CareerSync Capstone Project
 * 
 * @module Backend/Data/AssessmentsData
 * @description Standardized Skill Assessments & Technical MCQs for Verifiable Badges.
 * Prepared by Vikas Yadav (Database & Backend Architecture).
 */
const assessmentsData = [
    {
        title: 'JavaScript Core Competency Assessment',
        skillName: 'JavaScript',
        category: 'Technical',
        difficulty: 'Intermediate',
        description: 'Evaluates asynchronous programming, closures, event loop, scope, and ES6+ features.',
        timeLimitMinutes: 15,
        passingScorePercentage: 70,
        questions: [
            {
                questionText: 'What is the output of `typeof NaN` in JavaScript?',
                options: ['"undefined"', '"number"', '"object"', '"NaN"'],
                correctOptionIndex: 1,
                marks: 2,
                explanation: 'In JavaScript, NaN (Not a Number) is a numeric data type representing an unrepresentable value.'
            },
            {
                questionText: 'Which keyword creates a block-scoped variable that cannot be reassigned?',
                options: ['var', 'let', 'const', 'static'],
                correctOptionIndex: 2,
                marks: 2,
                explanation: 'const declares block-scoped variables whose identifiers cannot be reassigned.'
            },
            {
                questionText: 'What is the purpose of Promise.all()?',
                options: [
                    'Runs only the fastest promise and ignores others',
                    'Executes multiple promises concurrently and resolves when all resolve, or rejects on first error',
                    'Cancels all promises if one takes longer than 5 seconds',
                    'Converts asynchronous code to synchronous blocking code'
                ],
                correctOptionIndex: 1,
                marks: 2,
                explanation: 'Promise.all accepts an iterable of promises and fulfills when all promises fulfill.'
            },
            {
                questionText: 'What is a closure in JavaScript?',
                options: [
                    'A function bundled together with references to its lexical environment',
                    'A method that terminates an execution loop',
                    'A way to close an open database connection',
                    'A private HTML tag'
                ],
                correctOptionIndex: 0,
                marks: 2,
                explanation: 'A closure gives an inner function access to its outer function scope even after execution.'
            },
            {
                questionText: 'What order does the event loop prioritize microtasks and macrotasks?',
                options: [
                    'Macrotasks always execute before any microtask',
                    'Microtasks (e.g. Promise callbacks) execute before the next macrotask (e.g. setTimeout)',
                    'They run in random order based on thread availability',
                    'JavaScript does not have microtasks'
                ],
                correctOptionIndex: 1,
                marks: 2,
                explanation: 'Microtasks are processed after the current script executes and before rendering or next task.'
            }
        ]
    },
    {
        title: 'React.js & Frontend Architecture Quiz',
        skillName: 'React',
        category: 'Technical',
        difficulty: 'Intermediate',
        description: 'Assesses hooks, component lifecycles, virtual DOM reconciliation, and state management.',
        timeLimitMinutes: 15,
        passingScorePercentage: 70,
        questions: [
            {
                questionText: 'Why should you avoid updating state directly using `state.count = 5` in React?',
                options: [
                    'It causes a syntax error',
                    'React will not trigger a re-render because it relies on setter functions and shallow diffing',
                    'It slows down internet connection',
                    'Direct mutation is only allowed in production'
                ],
                correctOptionIndex: 1,
                marks: 2,
                explanation: 'Calling setState or hook setter notifies React of the change and schedules a re-render.'
            },
            {
                questionText: 'What is the purpose of the dependency array in useEffect()?',
                options: [
                    'To import npm packages into the component',
                    'To define which state/prop changes trigger re-running the effect',
                    'To list all CSS stylesheets needed by the effect',
                    'To prevent the effect from ever running'
                ],
                correctOptionIndex: 1,
                marks: 2,
                explanation: 'React compares values in the dependency array to determine if the effect needs execution.'
            },
            {
                questionText: 'What is the benefit of React.useMemo()?',
                options: [
                    'It memoizes the result of an expensive calculation between renders',
                    'It connects components directly to local storage',
                    'It automatically translates text into multiple languages',
                    'It replaces all Redux reducers'
                ],
                correctOptionIndex: 0,
                marks: 2,
                explanation: 'useMemo caches the calculated value between renders unless its dependencies change.'
            }
        ]
    },
    {
        title: 'MongoDB & Database Architecture Assessment',
        skillName: 'MongoDB',
        category: 'Technical',
        difficulty: 'Intermediate',
        description: 'Tests knowledge of indexing, BSON schemas, aggregation pipelines, and document validation.',
        timeLimitMinutes: 15,
        passingScorePercentage: 70,
        questions: [
            {
                questionText: 'What is a compound index in MongoDB?',
                options: [
                    'An index created on two or more fields of a single document',
                    'An index shared between two separate MongoDB clusters',
                    'A compressed string stored in memory',
                    'An index that automatically deletes expired documents'
                ],
                correctOptionIndex: 0,
                marks: 2,
                explanation: 'Compound indexes hold references to multiple fields within a collection in a specified sort order.'
            },
            {
                questionText: 'Which aggregation pipeline stage is used to filter documents in MongoDB?',
                options: ['$filter', '$where', '$match', '$find'],
                correctOptionIndex: 2,
                marks: 2,
                explanation: '$match filters documents to pass only matching documents to the next pipeline stage.'
            }
        ]
    }
];

module.exports = assessmentsData;
