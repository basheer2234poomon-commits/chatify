import User from '../models/User.js';
import Contact from '../models/Contact.js';

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const userId = req.userId;

    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } },
          ],
        },
        { _id: { $ne: userId } },
      ],
    }).select('-password').limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const userId = req.userId;

    const contacts = await Contact.find({ user: userId })
      .populate('contact', '-password')
      .sort({ addedAt: -1 });

    const contactUsers = contacts.map(c => c.contact);

    res.json(contactUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addContact = async (req, res) => {
  try {
    const { contactId } = req.body;
    const userId = req.userId;

    if (!contactId) {
      return res.status(400).json({ message: 'Contact ID is required' });
    }

    if (userId === contactId) {
      return res.status(400).json({ message: 'Cannot add yourself as a contact' });
    }

    const contact = await User.findById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingContact = await Contact.findOne({ user: userId, contact: contactId });
    if (existingContact) {
      return res.status(400).json({ message: 'Already a contact' });
    }

    const newContact = new Contact({ user: userId, contact: contactId });
    await newContact.save();

    res.status(201).json({
      message: 'Contact added successfully',
      contact: contact,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, bio, profilePicture } = req.body;
    const userId = req.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (name) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (profilePicture) user.profilePicture = profilePicture;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        profilePicture: user.profilePicture,
        bio: user.bio,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
