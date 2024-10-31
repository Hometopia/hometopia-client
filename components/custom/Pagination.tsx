import { ArrowLeft, ArrowRight } from "lucide-react-native"
import { Text } from "../ui/text"
import { useState } from "react"


const PageChangeButton = ({ leftDirection = true, onChange, isDisabled = false }: { leftDirection: boolean, onChange?: any, isDisabled?: boolean }) => {

  const containerStyle = "w-fit h-[36px] flex items-center gap-2 px-4 rounded-lg "
  const items = <>
    {leftDirection ? <ArrowLeft size={16} className="text-inherit" /> : <></>}
    <Text className="text-base text-inherit font-normal select-none">{leftDirection ? "Trước" : "Sau"}</Text>
    {!leftDirection ? <ArrowRight size={16} className="text-inherit" /> : <></>}
  </>

  if (!isDisabled) {
    return (
      <div className={`${containerStyle} bg-background-0 hover:bg-background-100 text-typography-900 hover:cursor-pointer`} onClick={onChange}>
        {items}
      </div>
    )
  }
  else {
    return (
      <div className={`${containerStyle} bg-background-0 text-typography-400 hover:cursor-default`}>
        {items}
      </div>
    )
  }
}

const PageNumber = ({ number, active = false, onChange }: { number: number, active?: boolean, onChange?: any }) => {

  const generalStyle = "w-[40px] h-[36px] flex items-center justify-center gap-1 rounded-lg hover:cursor-pointer"
  const styles = {
    default: `${generalStyle} bg-background-0 hover:bg-background-100 text-typography-900 font-normal`,
    active: `${generalStyle} bg-primary-50 hover:bg-primary-100 text-primary-400 font-bold`
  }
  return (
    <div className={active ? `${styles.active}` : `${styles.default}`} onClick={() => onChange(number)}>
      <Text className="text-base text-inherit leading-4">{number}</Text>
    </div>
  )
}

const Pages = ({ quantity, active, length = 5, onChange }: { quantity: number, active: number, length?: number, onChange?: any }) => {

  const Spread = () => (
    <div className="w-[40px] h-[36px] flex items-center gap-1 px-4 py-2 bg-background-0 text-typography-900">
      <Text className="text-md text-inherit font-medium leading-4 tracking-wider">...</Text>
    </div >
  )

  if (quantity <= length + 1) {
    return (
      <>
        {Array.from({ length: quantity }, (_, index) => (
          <PageNumber
            key={index + 1}
            number={index + 1}
            active={(active === index + 1) ? true : false}
            onChange={onChange} />
        ))}
      </>
    )
  }
  else if (active < length || active >= quantity - length + 2) {
    return (
      <>
        <PageNumber key={1} number={1} active={(active === 1) ? true : false} onChange={onChange} />
        {(active > length) ? <Spread /> : <></>}
        {
          Array.from({ length: length - 1 }, (_, index) => {
            if (active <= length) {
              return <PageNumber
                key={1 + 1 + index}
                number={1 + 1 + index}
                active={(active === index + 1 + 1) ? true : false}
                onChange={onChange}
              />
            }
            else if (active >= quantity - length + 2) {
              return <PageNumber
                key={quantity - length + 1 + index}
                number={quantity - length + 1 + index}
                active={(active === quantity - length + 1 + index) ? true : false}
                onChange={onChange}
              />
            }
          })
        }
        {(active < quantity - length + 1) ? <Spread /> : <></>}
        <PageNumber key={quantity} number={quantity} active={(active === quantity) ? true : false} onChange={onChange} />
      </>
    )
  }
  else {
    return (
      <>
        <PageNumber key={1} number={1} active={(active === 1) ? true : false} onChange={onChange} />
        <Spread />
        {
          Array.from({ length: 3 }, (_, index) => {
            return <PageNumber
              key={active + index - 1}
              number={active + index - 1}
              active={(active === active + index - 1) ? true : false}
              onChange={onChange}
            />
          })
        }
        <Spread />
        <PageNumber key={quantity} number={quantity} active={(active === quantity) ? true : false} onChange={onChange} />
      </>
    )
  }
}
export default function Pagination({ quantity, active, onChange }: { quantity: number, active: number, onChange: any }) {

  return (
    <div className="flex gap-2">
      <PageChangeButton leftDirection={true} isDisabled={active === 1 ? true : false} onChange={() => onChange(active - 1)} />
      <Pages quantity={quantity} active={active} onChange={onChange} />
      <PageChangeButton leftDirection={false} isDisabled={active === quantity ? true : false} onChange={() => onChange(active + 1)} />
    </div>
  )
}
