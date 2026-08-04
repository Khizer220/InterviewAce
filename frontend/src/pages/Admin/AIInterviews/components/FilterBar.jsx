import "./FilterBar.css";

const FilterBar = ({
  search,
  setSearch,
  category,
  setCategory,
  type,
  setType,
  difficulty,
  setDifficulty,
  status,
  setStatus,
  sort,
  setSort,
  categories,
}) => {
  return (
    <div className="filter-bar">

      <input
        type="text"
        placeholder="🔍 Search interview templates..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="">All Categories</option>

        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
      >
        <option value="">All Types</option>
        <option value="Technical">Technical</option>
        <option value="HR">HR</option>
        <option value="Aptitude">Aptitude</option>
        <option value="Mixed">Mixed</option>
      </select>

      <select
        value={difficulty}
        onChange={(e) => setDifficulty(e.target.value)}
      >
        <option value="">All Difficulty</option>
        <option value="Beginner">Beginner</option>
        <option value="Intermediate">Intermediate</option>
        <option value="Advanced">Advanced</option>
      </select>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option value="">All Status</option>
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="title">Title (A-Z)</option>
      </select>

    </div>
  );
};

export default FilterBar;