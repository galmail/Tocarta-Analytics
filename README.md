This is a Node.js Project of ToCarta.

start this project with: foreman start

The purpose of this project is to use Socket.io to enable Websockets and long polling
with the Heroku platform. The reason is:

1. Check tablets status
2. Update tablets
3. Send push messages to tablets (such as orders to the command center)


This project publish the following API:

--------------------------------
Name: Check tablet status, version, etc.
URI: /check/:tablet_id
Return:
{
	os: 'Android',
	os_version: '4.1.1',
	phonegap_version: '2.5.0',
	app_version: '1.3.1',
	device_model: 'Samsung Galaxy Tab',
	screen_size: '7',
	screen_resolution: '1024x600'
}
Error Codes:
	x: tablet_id is invalid
--------------------------------

--------------------------------
Name: Update tablet
URI: /update/:tablet_id
Return: { return: true } if tablet received message, false otherwise.
Error Codes:
	x: tablet_id is invalid
--------------------------------








