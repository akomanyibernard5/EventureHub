import React, { createContext, useState } from "react";


export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const url = "https://eventurehub.onrender.com"


  return (
    <EventContext.Provider value={{ selectedEvent, setSelectedEvent, isCommentModalOpen,url, setIsCommentModalOpen, isCreateModalOpen, setIsCreateModalOpen, setActiveSection, isUpdatingProfile, setIsUpdatingProfile, activeSection }}>
      {children}
    </EventContext.Provider>
  );
};
