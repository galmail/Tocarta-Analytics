Analytics Service is using:

https://github.com/tocarta/admin-template

https://developers.google.com/chart/interactive/docs/gallery

This is a Node.js Project of ToCarta.

start this project with: foreman start

The purpose of this project is to use Socket.io to enable Websockets and long polling
with the Heroku platform. The reason is:

1. Check tablets status
2. Update tablets
3. Send push messages to tablets (such as orders to the command center)

You can test proxy like this: http://localhost:5000/proxy?action=action_gal&channel=channel_gal