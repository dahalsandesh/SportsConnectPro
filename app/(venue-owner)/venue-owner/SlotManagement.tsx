"use client";
import React, { useState } from "react";
import { useGetTimeSlotsQuery, useCreateTimeSlotsMutation, useUpdateTimeSlotMutation } from "@/redux/api/venue-owner/timeSlotsApi";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

interface SlotManagementProps {
  courtId: string;
  date: string;
}

export default function SlotManagement({ courtId, date }: SlotManagementProps) {
  const [selectedDate, setSelectedDate] = useState(date);
  const [newSlots, setNewSlots] = useState([
    { startTime: "", endTime: "", price: "" }
  ]);
  const [editSlotId, setEditSlotId] = useState<string | null>(null);
  const [editSlot, setEditSlot] = useState<any>(null);

  const { data: slots = [], isLoading, isError, refetch } = useGetTimeSlotsQuery({ courtId, date: selectedDate });
  const [createTimeSlot, { isLoading: isCreating }] = useCreateTimeSlotMutation();
  const [updateTimeSlot, { isLoading: isUpdating }] = useUpdateTimeSlotMutation();

  // Handle new slot input change
  const handleSlotChange = (idx: number, field: string, value: string) => {
    setNewSlots((prev) => prev.map((slot, i) => i === idx ? { ...slot, [field]: value } : slot));
  };

  // Add another slot row
  const addSlotRow = () => {
    setNewSlots((prev) => [...prev, { startTime: "", endTime: "", price: "" }]);
  };

  // Remove slot row
  const removeSlotRow = (idx: number) => {
    setNewSlots((prev) => prev.filter((_, i) => i !== idx));
  };

  // Submit new slots
  const handleCreateSlots = async () => {
    for (const slot of newSlots) {
      if (!slot.startTime || !slot.endTime) continue;
      await createTimeSlot({
        courtId,
        date: selectedDate,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: slot.price ? Number(slot.price) : undefined,
      });
    }
    setNewSlots([{ startTime: "", endTime: "", price: "" }]);
    refetch();
  };

  // Start editing a slot
  const handleEdit = (slot: any) => {
    setEditSlotId(slot.id);
    setEditSlot({ ...slot });
  };

  // Save edited slot
  const handleSaveEdit = async () => {
    if (!editSlotId) return;
    await updateTimeSlot({
      id: editSlotId,
      ...editSlot,
    });
    setEditSlotId(null);
    setEditSlot(null);
    refetch();
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Manage Slots</CardTitle>
        <CardDescription>
          Date: <Input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)} className="inline w-auto ml-2" />
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Existing slots */}
        {isLoading ? (
          <div>Loading slots...</div>
        ) : isError ? (
          <div className="text-red-500">Failed to load slots.</div>
        ) : slots.length === 0 ? (
          <div className="text-muted-foreground">No slots found for this court/date.</div>
        ) : (
          <table className="w-full text-sm mb-4">
            <thead>
              <tr>
                <th>Start</th>
                <th>End</th>
                <th>Price</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {slots.map((slot: any) => (
                <tr key={slot.id}>
                  <td>
                    {editSlotId === slot.id ? (
                      <Input value={editSlot.startTime} onChange={e => setEditSlot({ ...editSlot, startTime: e.target.value })} type="time" />
                    ) : (
                      slot.startTime
                    )}
                  </td>
                  <td>
                    {editSlotId === slot.id ? (
                      <Input value={editSlot.endTime} onChange={e => setEditSlot({ ...editSlot, endTime: e.target.value })} type="time" />
                    ) : (
                      slot.endTime
                    )}
                  </td>
                  <td>
                    {editSlotId === slot.id ? (
                      <Input value={editSlot.price} onChange={e => setEditSlot({ ...editSlot, price: e.target.value })} type="number" min={0} />
                    ) : (
                      slot.price ?? "-"
                    )}
                  </td>
                  <td>{slot.isAvailable ? "Active" : "Inactive"}</td>
                  <td>
                    {editSlotId === slot.id ? (
                      <>
                        <Button size="sm" onClick={handleSaveEdit} disabled={isUpdating}>Save</Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditSlotId(null)}>Cancel</Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline" onClick={() => handleEdit(slot)}>Edit</Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {/* New slots form */}
        <div className="mb-2 font-semibold">Add New Slots</div>
        {newSlots.map((slot, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input type="time" value={slot.startTime} onChange={e => handleSlotChange(idx, "startTime", e.target.value)} />
            <Input type="time" value={slot.endTime} onChange={e => handleSlotChange(idx, "endTime", e.target.value)} />
            <Input type="number" min={0} placeholder="Price" value={slot.price} onChange={e => handleSlotChange(idx, "price", e.target.value)} />
            <Button size="sm" variant="ghost" onClick={() => removeSlotRow(idx)} disabled={newSlots.length === 1}>Remove</Button>
          </div>
        ))}
        <Button size="sm" variant="outline" onClick={addSlotRow}>Add Another Slot</Button>
        <Button className="ml-2" onClick={handleCreateSlots} disabled={isCreating}>Create Slots</Button>
      </CardContent>
    </Card>
  );
}
