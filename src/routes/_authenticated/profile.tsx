import { createFileRoute } from "@tanstack/react-router";
import { ProfileForm } from "./onboarding";

export const Route = createFileRoute("/_authenticated/profile")({ component: () => (
  <div className="mx-auto max-w-2xl space-y-6">
    <h1 className="text-3xl font-semibold">Your profile</h1>
    <ProfileForm submitLabel="Save changes" onDone={() => {}} />
  </div>
) });
