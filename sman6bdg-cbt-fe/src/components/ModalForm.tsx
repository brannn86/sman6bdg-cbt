import { type PropsWithChildren } from 'react'

const ModalForm = ({ children }: PropsWithChildren): JSX.Element => {
  return (
    <div>
      <input
        type="checkbox"
        id="form-question"
        className="modal-toggle"
        defaultChecked
      />
      <div className="modal z-[9999]">
        <div className="modal-box w-11/12 max-w-full">
          <h3 className="text-lg font-bold">Add Question</h3>
        </div>
      </div>
    </div>
  )
}

export default ModalForm
