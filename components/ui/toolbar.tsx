import { Input } from './input'
import { Button } from './button'

export default function Toolbar({ placeholder, onSearch }: { placeholder: string; onSearch?: (q: string) => void }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <Input placeholder={placeholder} />
      <Button variant="outline">Filter</Button>
      <Button>Search</Button>
    </div>
  )
}