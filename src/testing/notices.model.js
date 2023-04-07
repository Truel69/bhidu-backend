const mongoose = require('mongoose');

const noticeSchema = new mongoose.Schema({
    id: {
        type: Number,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    image: {
        type: String,
    },
    pdf: {
        type: String,
    },
});

const Notice = mongoose.model('Notice', noticeSchema);

module.exports = Notice;
