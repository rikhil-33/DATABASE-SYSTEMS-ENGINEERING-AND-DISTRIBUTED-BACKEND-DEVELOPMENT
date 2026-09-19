// Database: schoolDB

// 1. Insert Data
db.students.insertMany([
  { name: "Alice", age: 21, major: "Computer Science" },
  { name: "Bob", age: 22, major: "Mathematics" },
  { name: "Charlie", age: 23, major: "Physics" },
  { name: "David", age: 21, major: "Computer Science" },
  { name: "Eve", age: 22, major: "Mathematics" }
]);

db.courses.insertMany([
  { course: "DBMS", major: "Computer Science" },
  { course: "Algebra", major: "Mathematics" },
  { course: "Quantum Physics", major: "Physics" }
]);

// 2. CRUD Operations
db.students.find({ major: "Computer Science" });
db.students.updateOne({ name: "Alice" }, { $set: { age: 22 } });
db.students.deleteOne({ name: "Alice" });

// 3. Indexing
db.students.createIndex({ major: 1 });
db.students.getIndexes();
db.students.createIndex({ major: 1, age: -1 });
db.students.dropIndex("major_1");

// 4. Aggregation Pipelines
// Group and count
db.students.aggregate([
  { $group: { _id: "$major", total: { $sum: 1 } } }
]);

// Average age by major
db.students.aggregate([
  { $group: { _id: "$major", avgAge: { $avg: "$age" } } }
]);

// Sort by age
db.students.aggregate([
  { $sort: { age: -1 } }
]);

// Lookup (Join)
db.students.aggregate([
  {
    $lookup: {
      from: "courses",
      localField: "major",
      foreignField: "major",
      as: "enrolledCourses"
    }
  }
]);
