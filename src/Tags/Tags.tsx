import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button, Flex, Spinner, Table, TextField } from "@radix-ui/themes";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import * as Form from "@radix-ui/react-form";
import { DevTool } from "@hookform/devtools";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";

import { fetchTags } from "./fetchTags";
import Tag from "./Tag";
import RefreshPageButton from "./RefreshPageButton";
import Pagination from "./Pagination";
import { DEFAULT_PAGE_SIZE, MAX_TAG_COUNT } from "./consts";

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
        <Flex justify="center">
          <div className="min-w-[200px] mb-3">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="tagsNumber"
                control={control}
                render={({ field }) => (
                  <TextField.Root
                    {...field}
                    size="2"
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
              <Form.Submit asChild>
                <Button
                  color="cyan"
                  variant="soft"
                  className="cursor-pointer w-full"
                >
                  Wyszukaj
                </Button>
              </Form.Submit>
            </form>
          </div>
        </Flex>
      </div>
      {isPending ? (
        <div className="flex justify-center mt-4">
          <Spinner size="3" />
        </div>
      ) : (
        <>
          <div className="flex justify-center">
            <Table.Root variant="surface" className="w-full max-w-[700px]">
              <Table.Header>
                <Table.Row>
                  <Table.ColumnHeaderCell>Autor</Table.ColumnHeaderCell>
                  <Table.ColumnHeaderCell>
                    <Flex className="gap-2">
                      <span>Count</span>{" "}
                      {order === "asc" ? (
                        <ArrowDownIcon
                          onClick={() => setOrder("desc")}
                          className="cursor-pointer"
                        />
                      ) : (
                        <ArrowUpIcon
                          onClick={() => setOrder("asc")}
                          className="cursor-pointer"
                        />
                      )}
                    </Flex>
                  </Table.ColumnHeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {sortedData?.map((post, index) => {
                  const { name, count } = post;
                  return <Tag name={name} count={count} key={index} />;
                })}
              </Table.Body>
            </Table.Root>
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
