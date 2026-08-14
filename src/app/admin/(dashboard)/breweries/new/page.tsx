import { BreweryForm } from "../BreweryForm";
import { createBreweryAction } from "../actions";

export default function NewBreweryPage() {
  return (
    <div>
      <h1 className="mb-6 text-xl font-semibold text-neutral-900">Add brewery</h1>
      <BreweryForm action={createBreweryAction} submitLabel="Create brewery" />
    </div>
  );
}
