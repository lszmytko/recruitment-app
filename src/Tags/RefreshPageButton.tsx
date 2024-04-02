import { Button } from "@radix-ui/themes";

export default function RefreshPageButton() {
  return (
    <div>
      <p className="mb-4 text-red-500 text-center">Coś poszło nie tak...</p>
      <div className="flex justify-center">
        <Button
          variant="solid"
          className="cursor-pointer "
          onClick={() => window.location.reload()}
        >
          Odśwież stronę
        </Button>
      </div>
    </div>
  );
}
