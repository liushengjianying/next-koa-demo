import LRU from "lru-cache";

const cache = new LRU({
  maxAge: 1000 * 60 * 60
});

export function setCache(repo) {
  const full_name = repo.full_name;
  cache.set(full_name, repo);
}

// 类似 facebook/react
export function getCache(full_name) {
  return cache.get(full_name);
}

export function cacheArray(repos) {
  // debugger;
  if (repos && Array.isArray(repos)) {
    repos.forEach(item => {
      setCache(item);
    });
  }

//   repos.forEach(item => {
//     setCache(item);
//   });
}
