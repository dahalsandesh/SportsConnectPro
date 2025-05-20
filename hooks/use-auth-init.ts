"use client"

import { useEffect } from "react"
import { useAppDispatch } from "./redux"
import { checkAuth } from "@/redux/features/authSlice"

export function useAuthInit() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(checkAuth())
  }, [dispatch])

  return null
}
