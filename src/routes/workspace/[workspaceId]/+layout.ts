import { redirect } from '@sveltejs/kit';

export function load({ params }) {
  if (!params.workspaceId) {
    // If no workspaceId, redirect to a new one
    const newId = crypto.randomUUID();
    throw redirect(307, `/workspace/${newId}`);
  }
  return {};
}
