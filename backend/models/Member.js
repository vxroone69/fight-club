import mongoose from 'mongoose';

// Sphere/Circle schema
const sphereSchema = new mongoose.Schema({
  id: String,
  label: String,
  icon: String,
  color: String,
  desc: String,
}, { _id: false });

// Log entry schema
const logEntrySchema = new mongoose.Schema({
  date: String, // Format: YYYY-MM-DD
  sphereId: String,
  completed: Boolean,
  notes: String,
}, { _id: false });

// Note schema
const noteSchema = new mongoose.Schema({
  id: String,
  date: String,
  content: String,
  sphereId: String,
}, { _id: false });

const memberSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    spheres: [sphereSchema],
    logs: {
      type: Map,
      of: Boolean,
      default: new Map(),
    },
    notes: [noteSchema],
    setupDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Compound unique index on userId and name
memberSchema.index({ userId: 1, name: 1 }, { unique: true });

export const Member = mongoose.model('Member', memberSchema);
