"""Add table for comments

Revision ID: 0366ba6575ca
Revises: 1093835a1051
Create Date: 2020-08-14 00:46:54.161120

"""
from alembic import op  # noqa: I001
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "0366ba6575ca"
down_revision = "1093835a1051"
branch_labels = None
depends_on = None


def upgrade():
  
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "comments",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("type", sa.String(length=80), nullable=True),
        sa.Column("content", sa.Text(), nullable=True),
        sa.Column("date", sa.DateTime(), nullable=True),
        sa.Column("author_id", sa.Integer(), nullable=True),
        sa.Column("challenge_id", sa.Integer(), nullable=True),
        sa.Column("user_id", sa.Integer(), nullable=True),
        sa.Column("team_id", sa.Integer(), nullable=True),
        sa.Column("page_id", sa.Integer(), nullable=True),
        sa.ForeignKeyConstraint(["author_id"], ["users.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(
            ["challenge_id"], ["challenges.id"], ondelete="CASCADE"
        ),
        sa.ForeignKeyConstraint(["page_id"], ["pages.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["team_id"], ["teams.id"], ondelete="CASCADE"),
        sa.ForeignKeyConstraint(["user_id"], ["users.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("comments")
    # ### end Alembic commands ###
