import express from 'express';
import { post } from '../models/post.model.mjs';
import { upload } from '../maltermiddleware.mjs';


const postRoute = express.Router();


postRoute.get('/getAll', async (req, res) => {
    try {
      const data = await post.find().populate('likes').populate({path:'comments',populate:{path:'user', select:'name profile'},  options: { sort: { _id: -1 } } }).populate({path:'user_id', populate:{path:'university', select:'name' }}).sort({ createdAt: -1 });
      res.json(data);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching images', error });
    }
  })


// Upload Post
postRoute.post('/upload-post', upload.single('image'), async (req, res) => {
    try {
        const { 
            user_id,description,date, tags, locations, postBy
         } = req.body;
        const image = req.file?.filename;
        if(!image){
            return res.status(400).json({ message: 'No image uploaded' });
        }
       const postData = new post({ 
        user_id,
        description,
        date,
        tags,
        locations,
        photo:image,
        postBy
       });
      await postData.save();
  
      res.json({ message: 'Post uploaded successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  
postRoute.get('/getByUserId/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await post.find({user_id:id}).sort({ date: -1 }); // Fetch data in reverse order by date
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error });
  }
})

  
postRoute.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const data = await post.findById(id).populate('likes').populate('comments'); // Fetch data in reverse order by date
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching images', error });
  }
})




  export default postRoute;