import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { DevTool } from "@hookform/devtools";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";
import { Button } from "@/@/components/ui/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";

import { fetchTags } from "./fetchTags";
import Tag from "./Tag";
import RefreshPageButton from "./RefreshPageButton";
import Pagination from "./Pagination";
import { DEFAULT_PAGE_SIZE, MAX_TAG_COUNT } from "./consts";
import Loader from "./Loader";

interface FormInputs {
  tagsNumber: number;
}

const schema = z.object({
  tagsNumber: z.coerce
    .number()
    .min(1, { message: "Najmniejsza możliwa wartość: 1" })
    .max(MAX_TAG_COUNT, {
      message: `Największa możliwa wartość: ${MAX_TAG_COUNT}`,
    })
    .multipleOf(1, { message: "Wartość musi być liczbą całkowitą" }),
});

function Tags() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      tagsNumber: 5,
    },
    resolver: zodResolver(schema),
    reValidateMode: "onSubmit",
  });

  const tagsNumber = getValues("tagsNumber");
  const pageCount = Math.ceil(tagsNumber / DEFAULT_PAGE_SIZE);

  const { data, isError, mutate, isPending } = useMutation({
    mutationFn: () => fetchTags(page, tagsNumber),
  });

  useEffect(() => {
    mutate();
  }, [mutate, page]);

  if (isError) return <RefreshPageButton />;

  const sortedData = data?.data.items.sort((a, b) => {
    return order === "asc" ? a.count - b.count : b.count - a.count;
  });

  const onSubmit: SubmitHandler<FormInputs> = () => {
    mutate();
  };

  return (
    <div>
      <div>
        <div className="flex justify-center">
          <div className="min-w-[200px] mb-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="tagsNumber"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Liczba tagów na stronie"
                    type="number"
                    step={1}
                    className="mb-2"
                    max={MAX_TAG_COUNT}
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name="tagsNumber"
                render={({ message }) => (
                  <p className="text-red-500 text-sm text-center">{message}</p>
                )}
              />
              <Button color="cyan" className="cursor-pointer w-full">
                Wyszukaj
              </Button>
            </form>
          </div>
        </div>
      </div>
      {isPending ? (
        <div className="flex justify-center mt-4">
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <div>
              <Table className="max-w-[700px] w-screen">
                <TableHeader>
                  <TableRow>
                    <TableHead>Autor</TableHead>
                    <TableHead>
                      <div className="flex gap-2 items-center">
                        <span>Count</span>{" "}
                        {order === "asc" ? (
                          <FaArrowDown
                            onClick={() => setOrder("desc")}
                            className="cursor-pointer"
                          />
                        ) : (
                          <FaArrowUp
                            onClick={() => setOrder("asc")}
                            className="cursor-pointer"
                          />
                        )}
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData?.map((post, index) => {
                    const { name, count } = post;
                    return <Tag name={name} count={count} key={index} />;
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
          {tagsNumber > DEFAULT_PAGE_SIZE ? (
            <Pagination pageCount={pageCount} setPage={setPage} page={page} />
          ) : null}
        </>
      )}
      <DevTool control={control} />
    </div>
  );
}

export default Tags;
