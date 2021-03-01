import Category from "../models/Category.js"
import Channel from "../models/Channel.js";

export const createCategory =async  (req, res) => {
    const category = new Category({
        name: 'text channels',
        channels: ["603575144400185d54e3c70c", "603574e84400185d54e3c708"]
    });
    await category.save();
    res.status(200).send('nice')
}


export const addChannelToCategory = async (req, res) => {
    const { categoryId } = req.params;
    const { channel } = req.body;
    try {
    const foundCategory = await Category.findById(categoryId);
    const createdChannel = new Channel({ 
        ...channel,
    })
    const savedChannel = await createdChannel.save();

    foundCategory.channels.push({ 
        name: savedChannel.name,
         id: savedChannel._id,
          type: savedChannel.type});

    const savedCategory = await foundCategory.save();


    res.status(200).send(savedCategory)
    }
    catch (err) {
        console.error('bad', err.message)
        res.status(500).send('oops')
    }
}