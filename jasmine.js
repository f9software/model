const Jasmine = require('jasmine');
const jasmine = new Jasmine();

jasmine.loadConfig({
    spec_dir: 'dist/spec',
    spec_files: [
        '**/*[sS]pec.js'
    ],
    helpers: [
        'helpers/**/*[sS]pec.js'
    ],
    stopSpeconExecutionFailure: false,
    random: false
});

jasmine.configureDefaultReporter({
    showColors: true
});

jasmine.execute();
