import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Ruler } from 'lucide-react';
import { getSizeChart } from '@/data/products';

interface SizeGuideProps {
  category: string;
  subcategory: string;
}

export const SizeGuide = ({ category, subcategory }: SizeGuideProps) => {
  const sizeChart = getSizeChart(category, subcategory);

  if (!sizeChart) {
    return null;
  }

  const columns = sizeChart.sizes[0] ? Object.keys(sizeChart.sizes[0]) : [];

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Ruler className="h-4 w-4" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Size Guide</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-4">
            Find your perfect fit with our size chart. Measurements are in inches.
          </p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column} className="capitalize">
                      {column.replace(/([A-Z])/g, ' $1').trim()}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {sizeChart.sizes.map((row, index) => (
                  <TableRow key={index}>
                    {columns.map((column) => (
                      <TableCell key={column}>
                        {(row as any)[column] || '-'}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold mb-2">How to Measure</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• <strong>Chest:</strong> Measure around the fullest part of your chest</li>
              <li>• <strong>Waist:</strong> Measure around your natural waistline</li>
              <li>• <strong>Hip:</strong> Measure around the fullest part of your hips</li>
              <li>• <strong>Foot Length:</strong> Stand on paper and trace your foot, measure from heel to toe</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
