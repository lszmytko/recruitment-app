import { TableCell, TableRow } from "@/components/ui/table";

type Props = {
  name: string;
  count: number;
};

export default function Tag({ name, count }: Props) {
  return (
    <TableRow>
      <TableCell>{name}</TableCell>
      <TableCell className="text-right">
        {count.toLocaleString("en-US", {
          style: "decimal",
          maximumFractionDigits: 2,
        })}
      </TableCell>
    </TableRow>
  );
}
