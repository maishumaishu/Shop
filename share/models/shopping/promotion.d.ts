interface Promotion {
    Type: 'Given' | 'Reduce' | 'Discount',
    Contents: {
        Id: string,
        Description: string
    }[],
}