const Tag = require('../models/Tag');

// 📌 GET /api/tags?search=
exports.getAllTags = async (req, res) => {
  try {
    const search = req.query.search || '';
    const tags = await Tag.find({ name: { $regex: search, $options: 'i' } })
                          .sort({ createdAt: -1 });
    res.json({ tags });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi lấy danh sách tag' });
  }
};

// 📌 POST /api/tags
exports.createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Tên tag không được bỏ trống' });

    const existing = await Tag.findOne({ name });
    if (existing) return res.status(409).json({ message: 'Tag đã tồn tại' });

    const newTag = await Tag.create({ name });
    res.status(201).json({ message: 'Đã tạo tag mới', tag: newTag });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi tạo tag' });
  }
};

// 📌 PUT /api/tags/:id
exports.updateTag = async (req, res) => {
  try {
    const { name } = req.body;
    const updated = await Tag.findByIdAndUpdate(req.params.id, { name }, { new: true });
    if (!updated) return res.status(404).json({ message: 'Không tìm thấy tag' });
    res.json({ message: 'Đã cập nhật tag', tag: updated });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi cập nhật tag' });
  }
};

// 📌 DELETE /api/tags/:id
exports.deleteTag = async (req, res) => {
  try {
    const deleted = await Tag.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Không tìm thấy tag' });
    res.json({ message: 'Đã xoá tag' });
  } catch (err) {
    res.status(500).json({ message: 'Lỗi khi xoá tag' });
  }
};
