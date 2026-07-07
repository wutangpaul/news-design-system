import type { Meta, StoryObj } from "@storybook/react-vite";
import {
  Table,
  TableBody,
  TableCell,
  TableFoot,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "./Table";

const meta: Meta<typeof Table> = {
  title: "Components/Table",
  component: Table,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table caption="Closing figures for major indexes — Monday, July 6, 2026.">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Index</TableHeaderCell>
          <TableHeaderCell align="right">Close</TableHeaderCell>
          <TableHeaderCell align="right">Change</TableHeaderCell>
          <TableHeaderCell align="right">% Change</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>S&amp;P 500</TableCell>
          <TableCell numeric>6,214.38</TableCell>
          <TableCell numeric>+42.17</TableCell>
          <TableCell numeric>+0.68%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Dow Jones Industrial Average</TableCell>
          <TableCell numeric>44,891.02</TableCell>
          <TableCell numeric>−118.44</TableCell>
          <TableCell numeric>−0.26%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Nasdaq Composite</TableCell>
          <TableCell numeric>20,152.77</TableCell>
          <TableCell numeric>+201.35</TableCell>
          <TableCell numeric>+1.01%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Russell 2000</TableCell>
          <TableCell numeric>2,318.09</TableCell>
          <TableCell numeric>+5.62</TableCell>
          <TableCell numeric>+0.24%</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Table caption="City council special election — 4th district, 92% of precincts reporting.">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Candidate</TableHeaderCell>
          <TableHeaderCell>Party</TableHeaderCell>
          <TableHeaderCell align="right">Votes</TableHeaderCell>
          <TableHeaderCell align="right">Share</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Maria Chen</TableCell>
          <TableCell>Democratic</TableCell>
          <TableCell numeric>18,402</TableCell>
          <TableCell numeric>47.1%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Rob Ferreira</TableCell>
          <TableCell>Republican</TableCell>
          <TableCell numeric>15,977</TableCell>
          <TableCell numeric>40.9%</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Dana Whitfield</TableCell>
          <TableCell>Independent</TableCell>
          <TableCell numeric>4,688</TableCell>
          <TableCell numeric>12.0%</TableCell>
        </TableRow>
      </TableBody>
      <TableFoot>
        <TableRow>
          <TableCell colSpan={2}>Total votes counted</TableCell>
          <TableCell numeric>39,067</TableCell>
          <TableCell numeric>100%</TableCell>
        </TableRow>
      </TableFoot>
    </Table>
  ),
};

export const RowHeaders: Story = {
  render: () => (
    <Table caption="League standings after matchday 34.">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Club</TableHeaderCell>
          <TableHeaderCell align="right">Played</TableHeaderCell>
          <TableHeaderCell align="right">Won</TableHeaderCell>
          <TableHeaderCell align="right">Drawn</TableHeaderCell>
          <TableHeaderCell align="right">Lost</TableHeaderCell>
          <TableHeaderCell align="right">Points</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableHeaderCell scope="row" className="normal-case tracking-normal text-small text-text-primary">
            Riverport United
          </TableHeaderCell>
          <TableCell numeric>34</TableCell>
          <TableCell numeric>24</TableCell>
          <TableCell numeric>6</TableCell>
          <TableCell numeric>4</TableCell>
          <TableCell numeric>78</TableCell>
        </TableRow>
        <TableRow>
          <TableHeaderCell scope="row" className="normal-case tracking-normal text-small text-text-primary">
            Harbor City FC
          </TableHeaderCell>
          <TableCell numeric>34</TableCell>
          <TableCell numeric>22</TableCell>
          <TableCell numeric>8</TableCell>
          <TableCell numeric>4</TableCell>
          <TableCell numeric>74</TableCell>
        </TableRow>
        <TableRow>
          <TableHeaderCell scope="row" className="normal-case tracking-normal text-small text-text-primary">
            Milltown Rovers
          </TableHeaderCell>
          <TableCell numeric>34</TableCell>
          <TableCell numeric>19</TableCell>
          <TableCell numeric>7</TableCell>
          <TableCell numeric>8</TableCell>
          <TableCell numeric>64</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithoutCaption: Story = {
  render: () => (
    <Table aria-label="Commodity prices">
      <TableHead>
        <TableRow>
          <TableHeaderCell>Commodity</TableHeaderCell>
          <TableHeaderCell align="right">Price</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Crude oil (WTI)</TableCell>
          <TableCell numeric>$71.18</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Gold</TableCell>
          <TableCell numeric>$3,412.60</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};
