import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Box, Button, Flex, Spinner, Table, TextField } from "@radix-ui/themes";
import { ArrowDownIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import * as Form from "@radix-ui/react-form";
import { DevTool } from "@hookform/devtools";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ErrorMessage } from "@hookform/error-message";

import { fetchTags } from "./fetchTags";
import Tag from "./Tag";
import RefreshButton from "./RefreshButton";

interface FormInputs {
  tagsPerPage: number;
}

const schema = z.object({
  tagsPerPage: z.coerce
    .number()
    .min(1, { message: "Najmniejsza możliwa wartość: 1" })
    .max(50, { message: "Największa możliwa wartość: 50" })
    .multipleOf(1, { message: "Wartość musi być liczbą całkowitą" }),
});

function Tags() {
  const [order, setOrder] = useState<"asc" | "desc">("desc");
  const {
    handleSubmit,
    control,
    getValues,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: {
      tagsPerPage: 5,
    },
    resolver: zodResolver(schema),
    reValidateMode: "onSubmit",
  });

  const tagsPerPage = getValues("tagsPerPage");

  const { data, isError, mutate, isPending } = useMutation({
    mutationFn: () => fetchTags(tagsPerPage),
  });

  useEffect(() => {
    console.log("*** useeffect");
    mutate();
  }, [mutate]);

  console.log({ isPending });

  if (isError) return <RefreshButton />;

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
          <Box minWidth="200px" mb="10px">
            <form onSubmit={handleSubmit(onSubmit)}>
              <Controller
                name="tagsPerPage"
                control={control}
                render={({ field }) => (
                  <TextField.Root
                    {...field}
                    size="2"
                    placeholder="Liczba tagów na stronie"
                    type="number"
                    step={1}
                    className="mb-2"
                  />
                )}
              />
              <ErrorMessage
                errors={errors}
                name="tagsPerPage"
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
          </Box>
        </Flex>
      </div>
      {isPending ? (
        <div className="flex justify-center">
          <Spinner size="3" />
        </div>
      ) : (
        <Table.Root variant="surface">
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
      )}
      <DevTool control={control} />
    </div>
  );
}

export default Tags;
