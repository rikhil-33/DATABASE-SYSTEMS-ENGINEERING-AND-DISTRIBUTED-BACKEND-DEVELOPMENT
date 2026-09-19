// -------------------------------------------------------------
// TASK 1: Document Modeling
// -------------------------------------------------------------
db.book_metadata.insertOne({
  title: "The Silent Algorithm",
  author: "R. Menon",
  genre: "Technology",
  publishedYear: 2022,
  formats: ["Hardcover", "Digital", "Audiobook"],
  specs: { pages: 340, fileSize_MB: 4.2, drm: true, narrator: "K. Rao", runtime_min: 610 },
  avgRating: 4.6,
  reviews: [
    { member_id: "M1001", rating: 5, comment: "Excellent deep dive into digital systems design.", date: ISODate("2023-01-15") },
    { member_id: "M1042", rating: 4, comment: "Good but the Digital edition had formatting issues.", date: ISODate("2023-02-20") }
  ]
});

db.book_metadata.insertMany([
  {
    title: "Ocean of Code",
    author: "A. Fernandes",
    genre: "Technology",
    publishedYear: 2021,
    formats: ["Digital", "Paperback"],
    specs: { pages: 210, fileSize_MB: 2.1, drm: false },
    avgRating: 4.2,
    reviews: [
      { member_id: "M2001", rating: 4, comment: "Solid Digital read, clean layout.", date: ISODate("2022-05-10") },
      { member_id: "M2002", rating: 5, comment: "Best programming book this year.", date: ISODate("2022-06-01") }
    ]
  },
  {
    title: "Whispers of Yesterday",
    author: "S. Kapoor",
    genre: "Fiction",
    publishedYear: 2019,
    formats: ["Hardcover", "Paperback"],
    specs: { pages: 410, binding: "Sewn" },
    avgRating: 3.8,
    reviews: [
      { member_id: "M3001", rating: 3, comment: "Slow start but strong ending.", date: ISODate("2020-01-15") },
      { member_id: "M3002", rating: 4, comment: "Beautifully written prose.", date: ISODate("2020-02-11") }
    ]
  },
  {
    title: "Quantum Horizons",
    author: "R. Menon",
    genre: "Science",
    publishedYear: 2023,
    formats: ["Digital", "Audiobook"],
    specs: { fileSize_MB: 5.6, drm: true, narrator: "P. Iyer", runtime_min: 540 },
    avgRating: 4.9,
    reviews: [
      { member_id: "M4001", rating: 5, comment: "The Digital format made annotations so easy.", date: ISODate("2023-08-01") },
      { member_id: "M4002", rating: 5, comment: "Mind-bending and well narrated.", date: ISODate("2023-09-14") }
    ]
  }
]);

// -------------------------------------------------------------
// TASK 2: Advanced Querying
// -------------------------------------------------------------
// a) Books rated above 4 ($gt)
db.book_metadata.find({ avgRating: { $gt: 4 } }, { title: 1, avgRating: 1, _id: 0 });

// b) Books available in specific formats ($in)
db.book_metadata.find({ formats: { $in: ["Digital", "Audiobook"] } }, { title: 1, formats: 1, _id: 0 });

// c) Combined query using $and
db.book_metadata.find({ avgRating: { $gt: 4 }, formats: { $in: ["Digital"] } });

// d) Regex on formats
db.book_metadata.find({ formats: { $regex: "Digital", $options: "i" } }, { title: 1, formats: 1 });

// e) Nested Regex with positional projection
db.book_metadata.find({ "reviews.comment": { $regex: "Digital", $options: "i" } }, { title: 1, "reviews.$": 1 });

// -------------------------------------------------------------
// TASK 3: Aggregation Pipeline ("Top Rated" Report)
// -------------------------------------------------------------
db.book_metadata.aggregate([
  { $match: { publishedYear: { $gt: 2020 } } },
  { $unwind: "$reviews" },
  {
    $group: {
      _id: "$title",
      avgReviewRating: { $avg: "$reviews.rating" },
      totalReviews: { $sum: 1 },
      author: { $first: "$author" }
    }
  },
  { $sort: { avgReviewRating: -1 } },
  {
    $project: {
      _id: 0,
      title: "$_id",
      author: 1,
      avgReviewRating: { $round: ["$avgReviewRating", 2] },
      totalReviews: 1
    }
  }
]);

// -------------------------------------------------------------
// TASK 4: Indexing for Speed & Explain Plans
// -------------------------------------------------------------
// a) Text index on review comments
db.book_metadata.createIndex({ "reviews.comment": "text" });

// b) Text search with textScore
db.book_metadata.find(
  { $text: { $search: "Digital" } },
  { title: 1, score: { $meta: "textScore" } }
).sort({ score: { $meta: "textScore" } });

// c) Multikey index creation
db.book_metadata.createIndex({ formats: 1 });
db.book_metadata.createIndex({ avgRating: -1 });

// d) Query execution verification
db.book_metadata.find({ avgRating: { $gt: 4 } }).explain("executionStats");
