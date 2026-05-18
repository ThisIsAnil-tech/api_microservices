const fs = require('fs');
const path = require('path');

const logFile = path.join(__dirname, 'retry.log');

function logToFile(message) {
    const timestamp = new Date().toISOString();
    fs.appendFileSync(logFile, `[${timestamp}] ${message}\n`);
}

const retry = async (fn, options = {}) => {

    const {
        maxAttempts = 3,
        initialDelay = 1000,
        maxDelay = 30000,
        factor = 2,
        retryIf = () => true,
    } = options;

    let lastError;
    let delay = initialDelay;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {

        try {
            return await fn(attempt);

        } catch (error) {

            lastError = error;

            console.log(
                `Attempt ${attempt} failed, retrying in ${delay}ms...`
            );

            logToFile(
                `Attempt ${attempt} failed, retrying in ${delay}ms...`
            );

            if (
                attempt === maxAttempts ||
                !retryIf(error)
            ) {
                throw error;
            }

            await new Promise(resolve =>
                setTimeout(resolve, delay)
            );

            delay = Math.min(delay * factor, maxDelay);
        }
    }

    throw lastError;
};

const callExternalService = async () => {

    return retry(

        async (attempt) => {

            logToFile(`Making attempt #${attempt}`);

            const url = 'https://youtube.com';

            const response = await fetch(url);

            if (!response.ok) {

                const error = new Error(
                    `HTTP ${response.status}`
                );

                throw error;
            }

            return response.json();
        },

        {
            maxAttempts: 3,
            retryIf: (error) => true
        }
    );
};

callExternalService()
    .then(result =>
        logToFile(
            "Success: " + JSON.stringify(result)
        )
    )
    .catch(error =>
        logToFile(
            "Final failure: " + error.message
        )
    );