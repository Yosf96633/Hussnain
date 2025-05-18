// controllers/gameController.js
import { config } from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import { uploadToCloudinary } from '../config/cloudinary.js';
import { supabase } from '../config/supabaseClient.js';
config(); // Load env vars

export const addGame = async (req, res) => {
  try {

    const { title, description, downloadLink } = req.body;
    const files = req.files;
      const downloadlinkArray = JSON.parse(downloadLink)
    if (!title || !description || !downloadLink) {
      return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // 1. Upload Images
    const imageUrls = [];
    if (files.images) {
      for (const file of files.images) {
        const url = await uploadToCloudinary(file.buffer, 'games/images', 'image');
        imageUrls.push(url);
      }
    }

    // 2. Upload Video
    let videoUrl = '';
    if (files.video && files.video.length > 0) {
      videoUrl = await uploadToCloudinary(files.video[0].buffer, 'games/videos', 'video');
    }

    // 3. Save to Supabase
    const { error } = await supabase.from('games').insert([
      {
        id: uuidv4(),
        title,
        description,
        downloadlink : downloadlinkArray,
        images: imageUrls,
        video: videoUrl,
      }
    ]);

    if (error) throw error;

    return res.status(201).json({ success: true, message: 'Game added successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


export const getGameById = async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('games')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(404).json({
      success: false,
      message: 'Game not found',
      error: error.message,
    });
  }

  return res.status(200).json({
    success: true,
    game: data,
  });
};

export const getAllGames = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("games")
      .select("*")
      .order("created_at", { ascending: false }); // optional: order by latest

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, games: data });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteGameById = async (req, res) => {
  const { id } = req.params;

  try {
    const { error } = await supabase
      .from("games")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, message: "Game deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteAllGames = async (req, res) => {
  try {
    const { error } = await supabase
      .from("games")
      .delete()
      .not("id", "is", null);// delete all rows where id != ''

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, message: "All games deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};


