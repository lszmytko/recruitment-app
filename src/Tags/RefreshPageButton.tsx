import { Button } from "@/@/components/ui/button";

export default function RefreshPageButton() {
  return (
    <div>
      <p className="mb-4 text-red-500 text-center">Coś poszło nie tak...</p>
      <div className="flex justify-center">
        <Button
          className="cursor-pointer"
          variant="secondary"
          onClick={() => window.location.reload()}
        >
          Odśwież stronę
        </Button>
      </div>
    </div>
  );
}
