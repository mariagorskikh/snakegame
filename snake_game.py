import pygame
import random
import sys

# Initialize Pygame
pygame.init()

# Constants
WINDOW_SIZE = 600
GRID_SIZE = 20
GRID_COUNT = WINDOW_SIZE // GRID_SIZE

# Colors
BLACK = (0, 0, 0)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
WHITE = (255, 255, 255)

# Initialize screen
screen = pygame.display.set_mode((WINDOW_SIZE, WINDOW_SIZE))
pygame.display.set_caption('Snake Game')

# Initialize clock
clock = pygame.time.Clock()

class Snake:
    def __init__(self):
        self.positions = [(GRID_COUNT // 2, GRID_COUNT // 2)]
        self.direction = (1, 0)
        self.add_segment = False
        
    def get_head_position(self):
        return self.positions[0]
    
    def update(self):
        current = self.get_head_position()
        x, y = self.direction
        new = ((current[0] + x) % GRID_COUNT, (current[1] + y) % GRID_COUNT)
        
        if new in self.positions[1:]:
            return False
        
        self.positions.insert(0, new)
        if not self.add_segment:
            self.positions.pop()
        else:
            self.add_segment = False
        return True
    
    def draw(self):
        for position in self.positions:
            rect = pygame.Rect(position[0] * GRID_SIZE, position[1] * GRID_SIZE,
                             GRID_SIZE - 2, GRID_SIZE - 2)
            pygame.draw.rect(screen, GREEN, rect)

class Food:
    def __init__(self):
        self.position = (0, 0)
        self.randomize_position()
        
    def randomize_position(self):
        self.position = (random.randint(0, GRID_COUNT - 1),
                        random.randint(0, GRID_COUNT - 1))
    
    def draw(self):
        rect = pygame.Rect(self.position[0] * GRID_SIZE, self.position[1] * GRID_SIZE,
                          GRID_SIZE - 2, GRID_SIZE - 2)
        pygame.draw.rect(screen, RED, rect)

def main():
    snake = Snake()
    food = Food()
    score = 0
    
    while True:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_UP and snake.direction != (0, 1):
                    snake.direction = (0, -1)
                elif event.key == pygame.K_DOWN and snake.direction != (0, -1):
                    snake.direction = (0, 1)
                elif event.key == pygame.K_LEFT and snake.direction != (1, 0):
                    snake.direction = (-1, 0)
                elif event.key == pygame.K_RIGHT and snake.direction != (-1, 0):
                    snake.direction = (1, 0)
        
        # Update snake
        if not snake.update():
            break
        
        # Check for food collision
        if snake.get_head_position() == food.position:
            snake.add_segment = True
            food.randomize_position()
            score += 1
        
        # Draw everything
        screen.fill(BLACK)
        snake.draw()
        food.draw()
        
        # Draw score
        font = pygame.font.Font(None, 36)
        score_text = font.render(f'Score: {score}', True, WHITE)
        screen.blit(score_text, (10, 10))
        
        pygame.display.update()
        clock.tick(10)  # Control game speed
    
    # Game Over
    font = pygame.font.Font(None, 74)
    text = font.render('Game Over!', True, WHITE)
    screen.blit(text, (WINDOW_SIZE // 4, WINDOW_SIZE // 2))
    pygame.display.update()
    pygame.time.wait(2000)
    pygame.quit()
    sys.exit()

if __name__ == '__main__':
    main()
