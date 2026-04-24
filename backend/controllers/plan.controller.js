import StudyPlan from "../models/StudyPlan.js";

export async function listPlans(req, res, next) {
  try {
    const plans = await StudyPlan.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) { next(err); }
}

export async function getPlan(req, res, next) {
  try {
    const plan = await StudyPlan.findOne({ _id: req.params.id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (err) { next(err); }
}

export async function createPlan(req, res, next) {
  try {
    const plan = await StudyPlan.create({ ...req.body, user: req.user._id });
    res.status(201).json(plan);
  } catch (err) { next(err); }
}

export async function updatePlan(req, res, next) {
  try {
    const plan = await StudyPlan.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (err) { next(err); }
}

export async function deletePlan(req, res, next) {
  try {
    const result = await StudyPlan.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!result) return res.status(404).json({ message: "Plan not found" });
    res.json({ ok: true });
  } catch (err) { next(err); }
}

export async function toggleTask(req, res, next) {
  try {
    const { id, taskId } = req.params;
    const plan = await StudyPlan.findOne({ _id: id, user: req.user._id });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    const task = plan.tasks.id(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });
    task.completed = !task.completed;
    await plan.save();
    res.json(plan);
  } catch (err) { next(err); }
}
