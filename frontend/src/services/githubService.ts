import type { GitHubRepo } from '../types';

const GITHUB_USER = 'AdriaPascual';
const CACHE_KEY = 'gh_repos';
const CACHE_TTL = 15 * 60 * 1000;

export async function getPublicRepos(): Promise<GitHubRepo[]> {
  const cached = sessionStorage.getItem(CACHE_KEY);
  if (cached) {
    const { ts, data } = JSON.parse(cached);
    if (Date.now() - ts < CACHE_TTL) return data;
  }

  const res = await fetch(
    `https://api.github.com/users/${GITHUB_USER}/repos?sort=updated&per_page=10`,
    { headers: { Accept: 'application/vnd.github+json' } }
  );

  if (!res.ok) throw new Error(`GitHub API ${res.status}`);

  const data: GitHubRepo[] = await res.json();
  sessionStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), data }));
  return data;
}
