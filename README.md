# The Index

The Index is an IPFS-hosted app which acts as a directory for files added to IPFS.

Users can browse already-added files and add information about their own uploaded files. This app is completely decentralized, using PubSub to allow different IPFS nodes to communicate with each other and share database state.

To configure your IPFS daemon to allow access to this service, run the following commands
```
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin "[\"*\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Credentials "[\"true\"]"
ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods "[\"PUT\", \"POST\", \"GET\"]"
```
These will allow the app to control your daemon, something essential for the decentralized operation of the app.

Then start up your daemon with the following command
```
ipfs daemon --enable-pubsub-experiment
```
Now you can navigate to [The Index](http://localhost:8080/ipfs/QmXny7UjYEiFXskWr5Un6p5DMZPU87yzdmC3VEQcCx9xBC)
