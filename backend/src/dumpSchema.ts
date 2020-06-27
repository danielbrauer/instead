import { exec } from 'child_process'

exec(`pg_dump ${process.env.DATABASE_URL} --schema-only --no-owner --no-privileges --file=schema.sql`, (err, stdout, stderr) => {
    if (err) {
        //some err occurred
        console.error(err)
    } else {
        // the *entire* stdout and stderr (buffered)
        console.log(`stdout: ${stdout}`)
        console.log(`stderr: ${stderr}`)
    }
})
