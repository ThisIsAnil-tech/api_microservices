>cd exp7
>npm init -y
>npm install express
>New-Item app.js
>New-Item service1.json
>New-Item service2.json

>node app.js

# consul (cmd)
>cd C:\consul
>consul agent -dev

# consul (cmd)
# >consul services register <path>
>consul services register C:\gitClones\api_microservices\exp7\service1.json
>consul services register C:\gitClones\api_microservices\exp7\service2.json

# new (cmd) seperate
>set PORT=3001 && node app.js
>set PORT=3002 && node app.js

# optional checking
>consul catalog nodes
>consul catalog services

