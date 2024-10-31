import { Input, InputField, InputIcon, InputSlot } from "@/components/ui/input";
import { ChevronDownIcon, SearchIcon } from "lucide-react-native";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { useEffect, useRef, useState } from "react";


type SelectItemType = { label: string, value: string, onClick?: ((value: string) => void) | any, }

const SelectItemContainer = ({ id, items, className, onChange, parentRect }: { id?: string, items: SelectItemType[], className?: string, onChange: any, parentRect?: any }) => {
  const divRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const adjustPos = { top: (parentRect.height + 12), left: position.left }
    if (divRef.current) {
      //Điều chỉnh nếu container vượt ra khỏi biên màn hình
      if (parentRect.left + divRef.current.getBoundingClientRect().width > window.innerWidth) {
        adjustPos.left = adjustPos.left - (divRef.current.getBoundingClientRect().width - parentRect.width)
      }

      if (parentRect.top + divRef.current.getBoundingClientRect().height > window.innerHeight) {
        adjustPos.top = - (divRef.current.getBoundingClientRect().height + 12)
      }
    }

    setPosition(adjustPos);
  }, []);

  const [searchTerm, setSearchTerm] = useState("")
  const handleItemPressed = (value: string) => {
    if (onChange !== undefined && onChange !== null)
      onChange(value)
  }
  const itemTagList = items
    .filter(item => item.label.toLowerCase().includes(searchTerm.toLowerCase()))
    .map((item) => (
      <div key={`${item.value}`} className="w-full px-3 py-2 bg-white hover:bg-background-100 cursor-pointer" onClick={() => handleItemPressed(item.value)}>
        <Text className="text-sm text-typography-900">{item.label}</Text>
      </div>))

  return (
    <div
      ref={divRef}
      style={{
        position: 'absolute',
        top: `${position.top}px`,
        left: `${position.left}px`
      }}
      className={`${className} flex flex-col  px-3 py-4 rounded-md shadow-hard-1 bg-white z-50`}
    >
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

export function FilterSelect(
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
      className="relative h-fit"
    >
      <div
        className="cursor-pointer z-10 flex items-center gap-4 px-3 py-2 rounded-lg bg-background-0 hover:bg-background-100"
        onClick={() => setActive(prev => !prev)}
      >
        <Text className="text-md">{placeholder}: {value}</Text>
        <ChevronDownIcon size={20} />
      </div>
      {active ?
        <SelectItemContainer id="select-container" className="w-[260px] h-60" items={items} onChange={onChange} parentRect={containerRef?.current?.getBoundingClientRect()} />
        : <></>}

    </div>

  )
}