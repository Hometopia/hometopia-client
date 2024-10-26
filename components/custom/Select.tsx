import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ChevronDownIcon, SearchIcon } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { useEffect, useRef, useState } from "react";


type SelectItemType = { label: string, value: string, onClick?: ((value: string) => void) | any, }

const SelectItemContainer = ({ items, className, onChange }: { items: SelectItemType[], className?: string, onChange: any }) => {

  const [searchTerm, setSearchTerm] = useState("")

  const itemTagList = items
    .filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((item) => (
      <div key={`${item.value}`} className="w-full px-3 py-2 bg-white hover:bg-background-100 cursor-pointer" onClick={() => handleItemPressed(item.value)}>
        <Text className="text-sm text-typography-900">{item.label}</Text>
      </div>))


  const handleItemPressed = (value: string) => {
    if (onChange !== undefined && onChange !== null)
      onChange(value)
  }
  return (
    <div className={`${className} flex flex-col absolute top-12 px-3 py-4 rounded-md shadow-hard-1 bg-white z-50`} >
      <Input>
        <InputField type="text" placeholder='Tìm kiếm' value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} />
        <InputSlot className="pr-3">
          <InputIcon
            as={SearchIcon}
            className="text-typography-500"
          />
        </InputSlot>
      </Input>

      {itemTagList.length === 0 ? <div className="flex justify-center items-center w-full h-full text-typography-500">Không tìm thấy</div> :
        <VStack className="overflow-y-scroll">
          {itemTagList}
        </VStack>}
    </div>
  )
}

export function Select(
  {
    placeholder,
    value,
    onChange

  }: {
    placeholder?: string,
    value?: string,
    onChange?: any
  }
) {

  const [active, setActive] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClickAnywhere = (event: MouseEvent) => {
    if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
      setActive(false)
    }
  }


  useEffect(() => {
    document.addEventListener('mousedown', handleClickAnywhere);
    return () => {
      document.removeEventListener('mousedown', handleClickAnywhere);
    };
  }, [])

  const items: SelectItemType[] = [
    {
      value: '1',
      label: '1'
    },
    {
      value: '2',
      label: '1'
    },
    {
      value: '3',
      label: '1'
    },
    {
      value: '4',
      label: '1'
    },
    {
      value: '5',
      label: '1'
    },
    {
      value: '6',
      label: '1'
    },
    {
      value: '7',
      label: '1'
    },
    {
      value: '8',
      label: '1'
    }
  ]
  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <div
        className="cursor-pointer z-10"
        onClick={() => setActive(prev => !prev)}
      >
        <Input className="text-center " isReadOnly>
          <InputField type="text" placeholder={placeholder} value={value} />
          <InputSlot className="pr-3">
            <InputIcon
              as={ChevronDownIcon}
              className="text-typography-500"
            />
          </InputSlot>
        </Input>
      </div>
      {active ?
        <SelectItemContainer className="w-full h-60" items={items} onChange={onChange} />
        : <></>}

    </div>

  )
}