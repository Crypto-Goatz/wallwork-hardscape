const VERCEL_API = "https://api.vercel.com";

function getHeaders() {
  const token = process.env.VERCEL_TOKEN;
  if (!token) throw new Error("VERCEL_TOKEN is not configured");
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

function getProjectId() {
  const id = process.env.VERCEL_PROJECT_ID;
  if (!id) throw new Error("VERCEL_PROJECT_ID is not configured");
  return id;
}

/**
 * Set or update an environment variable on the Vercel project.
 */
export async function setEnvVar(
  key: string,
  value: string,
  target: ("production" | "preview" | "development")[] = ["production", "preview", "development"]
): Promise<void> {
  const projectId = getProjectId();
  const headers = getHeaders();

  // Try to get existing env vars to check if we need to update
  const listRes = await fetch(
    `${VERCEL_API}/v9/projects/${projectId}/env`,
    { headers }
  );
  const listData = await listRes.json();
  const existing = listData.envs?.find(
    (e: { key: string }) => e.key === key
  );

  if (existing) {
    // Update existing
    await fetch(
      `${VERCEL_API}/v9/projects/${projectId}/env/${existing.id}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ value, target }),
      }
    );
  } else {
    // Create new
    await fetch(
      `${VERCEL_API}/v10/projects/${projectId}/env`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({
          key,
          value,
          target,
          type: "encrypted",
        }),
      }
    );
  }
}

/**
 * Set multiple env vars in sequence.
 */
export async function setEnvVars(
  vars: Record<string, string>
): Promise<void> {
  for (const [key, value] of Object.entries(vars)) {
    await setEnvVar(key, value);
  }
}

/**
 * Trigger a redeployment of the Vercel project.
 */
export async function triggerRedeploy(): Promise<{ url: string }> {
  const projectId = getProjectId();
  const headers = getHeaders();

  // Get the latest deployment to find the git ref
  const deploymentsRes = await fetch(
    `${VERCEL_API}/v6/deployments?projectId=${projectId}&limit=1`,
    { headers }
  );
  const deploymentsData = await deploymentsRes.json();
  const latest = deploymentsData.deployments?.[0];

  if (!latest) {
    throw new Error("No existing deployments found");
  }

  // Create a new deployment by redeploying the latest
  const res = await fetch(`${VERCEL_API}/v13/deployments`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: latest.name,
      target: "production",
      gitSource: latest.gitSource || undefined,
      projectId,
    }),
  });

  const data = await res.json();
  return { url: `https://${data.url || data.alias?.[0] || "vercel.app"}` };
}
