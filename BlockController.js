const SHA256 = require('crypto-js/sha256');
const Block = require('./block.js');
const bodyParser = require('body-parser');
const Blockchain = require('./simpleChain');
const chain = new Blockchain();
/**
 * Controller Definition to encapsulate routes to work with blocks
 */
class BlockController {

    /**
     * Constructor to create a new BlockController, you need to initialize here all your endpoints
     * @param {*} app 
     */
    constructor(app) {
        this.app = app;
        this.blocks = [];
        this.initializeMockData();
        this.app.use(bodyParser.json());
        this.getBlockByIndex();
        this.postNewBlock();
    }


    

    /**
     * Implement a GET Endpoint to retrieve a block by index, url: "/block/:index"
     */
    getBlockByIndex() {
        this.app.get("/block/:index", async (req, res) => {
            try {
                const response = await chain.getBlock(req.params.index)
                res.send(response)
              } catch (error) {
                res.status(404).json({
                  "status": 404,
                  "message": "Block not found"
                })
              }
        });
    }

    /**
     * Implement a POST Endpoint to add a new Block, url: "/block"
     */
    postNewBlock() {
        this.app.post("/block", async (req, res) => {
             if (req.body.body === '' || req.body.body === undefined) {
                res.status(400).json({
                  "status": 400,
                  message: "No content, fill the body parameter"
                })
              }

              await chain.addBlock(new Block(req.body.body))
              const height = await chain.getBlockHeight()
              const response = await chain.getBlock(height)

              res.status(201).send(response)
        });
    }

    /**
     * Help method to inizialized Mock dataset, adds 10 test blocks to the blocks array
     */
    initializeMockData() {
        if(this.blocks.length === 0){
            for (let index = 0; index < 10; index++) {
                let blockAux = new Block(`Test Data #${index}`);
                blockAux.height = index;
                blockAux.hash = SHA256(JSON.stringify(blockAux)).toString();
                this.blocks.push(blockAux);
            }
        }
    }

}

/**
 * Exporting the BlockController class
 * @param {*} app 
 */
module.exports = (app) => { return new BlockController(app);}