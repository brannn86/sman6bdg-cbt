const DisabledComboBox = ({ text }: { text: string }): JSX.Element => {
  return (
    <select
      disabled
      className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
    >
      <option>{text}</option>
    </select>
  )
}

export default DisabledComboBox
