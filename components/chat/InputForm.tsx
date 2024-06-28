'use client'
import React from 'react'
import { Button } from '../ui/button'
import { Input } from '../ui/input'

type InputProps = {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  message: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const InputForm = ({
  handleSubmit,
  message,
  onChange,
}: InputProps) => {
  return (
    <form onSubmit={handleSubmit}>
      <div className="flex w-full items-center space-x-2">
        <Input
          name="message"
          placeholder="Enter your message"
          value={message}
          onChange={onChange}
          autoComplete={'off'}
          required
        />
        <Button type="submit">Send</Button>
      </div>
    </form>
  )
}

export default InputForm
