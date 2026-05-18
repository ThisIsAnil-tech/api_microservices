>mkdir exp8
>cd exp8

>mkdir user, prod

>cd user 
>New-Item app.js
>npm init -y
>npm install express

>cd ../prod
>New-Item app.js
>npm init -y
>npm install express

# sep terminal
>node user.js
>node prod.js

# copy this to *C:\nginx\conf\nginx.conf* file with this file *C:\exp8\nginx.conf*

>cd C:\nginx\conf\
>cat nginx.conf

>start nginx
>nginx -s reload  # if changes made
