export interface IClicksendTextMessage
{    
    to: string,
    body: string,
    from?: string;
}

export interface IClicksendVoiceMessage
{    
    to: string,
    body: string,
    voice: string,
    country?: string,
    lang: string
}