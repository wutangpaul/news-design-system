import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { createRef } from "react";
import { axe } from "vitest-axe";
import {
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "./Table";

function SampleTable() {
  return (
    <Table caption="Closing figures for major indexes.">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Index</TableHeaderCell>
          <TableHeaderCell align="right">Close</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>S&amp;P 500</TableCell>
          <TableCell numeric>6,214.38</TableCell>
        </TableRow>
      </TableBody>
      <TableFoot>
        <TableRow>
          <TableCell>Total</TableCell>
          <TableCell numeric>1</TableCell>
        </TableRow>
      </TableFoot>
    </Table>
  );
}

describe("Table", () => {
  it("renders a native table with a real caption", () => {
    render(<SampleTable />);
    const table = screen.getByRole("table", { name: "Closing figures for major indexes." });
    expect(table.tagName).toBe("TABLE");
    expect(table.querySelector("caption")).toHaveTextContent(
      "Closing figures for major indexes.",
    );
  });

  it("wraps the table in a horizontally scrollable container", () => {
    render(<SampleTable />);
    const wrapper = screen.getByRole("table").parentElement;
    expect(wrapper).toHaveClass("overflow-x-auto");
  });

  it("defaults header cells to scope=col", () => {
    render(<SampleTable />);
    expect(screen.getByRole("columnheader", { name: "Index" })).toHaveAttribute(
      "scope",
      "col",
    );
  });

  it("supports scope=row for row headers", () => {
    render(
      <Table caption="Standings.">
        <TableBody>
          <TableRow>
            <TableHeaderCell scope="row">Riverport United</TableHeaderCell>
            <TableCell numeric>78</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByRole("rowheader", { name: "Riverport United" })).toHaveAttribute(
      "scope",
      "row",
    );
  });

  it("right-aligns numeric cells in the mono face with tabular figures", () => {
    render(<SampleTable />);
    const cell = screen.getByRole("cell", { name: "6,214.38" });
    expect(cell.className).toContain("font-mono");
    expect(cell.className).toContain("tabular-nums");
    expect(cell.className).toContain("text-right");
  });

  it("lets align override the numeric right-alignment", () => {
    render(
      <Table caption="Alignment override.">
        <TableBody>
          <TableRow>
            <TableCell numeric align="center" data-testid="cell">
              42
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByTestId("cell").className).toContain("text-center");
    expect(screen.getByTestId("cell").className).not.toContain("text-right");
  });

  it("renders without a caption when omitted", () => {
    render(
      <Table aria-label="Commodity prices" data-testid="table">
        <TableBody>
          <TableRow>
            <TableCell>Gold</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByTestId("table").querySelector("caption")).toBeNull();
  });

  it("forwards a ref to the table element", () => {
    const ref = createRef<HTMLTableElement>();
    render(
      <Table ref={ref} caption="Ref test.">
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(ref.current?.tagName).toBe("TABLE");
  });

  it("spreads remaining props onto the table element", () => {
    render(
      <Table caption="Props test." data-testid="table">
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );
    expect(screen.getByTestId("table").tagName).toBe("TABLE");
  });

  it("has no axe violations", async () => {
    const { container } = render(<SampleTable />);
    const results = await axe(container);
    expect(results.violations).toEqual([]);
  });
});
