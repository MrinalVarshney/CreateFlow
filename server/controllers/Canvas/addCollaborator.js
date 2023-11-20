const Canvas  = require("../../models/Canvas/canvasSchema");   
const User = require("../../models/userSchema");

const addCollaborator = async (req, res) => {
    const {canvasId, collaboratorId} = req.body;
    try {
        const canvas = await Canvas.findById(canvasId);
        if(!canvas){
            return res.status(400).send("Canvas not found");
        }
        const collaborator = await User.findById(collaboratorId);
        if(!collaborator){
            return res.status(400).send("Collaborator not found");
        }
        if(canvas.collaborators.includes(collaboratorId)){
            return res.status(400).send("Collaborator already added");
        }
        await canvas.collaborators.push(collaboratorId);
        await canvas.save();
        await collaborator.collaboratedCanvases.push(canvasId);
        await collaborator.save();
        res.status(201).json({
            success: true,
            canvasId: canvas._id,
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).send("Server Error");
    }
}

module.exports = addCollaborator;