>mkdir exp6
>cd exp6

>mkdir user, prod
>New-Item docker-compose.yaml

>cd user 
>New-Item app.js
>New-Item Dockerfile
>npm init -y
>npm install express

>cd ../prod
>New-Item app.js
>New-Item Dockerfile
>npm init -y
>npm install express

>cd..
# open docker desktop
>docker compose build 
>docker compose up
