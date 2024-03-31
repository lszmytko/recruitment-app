import { Table } from "@radix-ui/themes";

type Props = {
  name: string;
  count: number;
};

export default function Tag({ name, count }: Props) {
  return (
    <Table.Row>
      <Table.Cell>{name}</Table.Cell>
      <Table.Cell>
        {count.toLocaleString("en-US", {
          style: "decimal",
          maximumFractionDigits: 2,
        })}
      </Table.Cell>
    </Table.Row>
  );
}
